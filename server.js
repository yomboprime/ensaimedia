
// - Requires -

var child_process = require( 'child_process' );

var SerialPort = require( 'serialport' );

var Peer = require( 'simple-peer' );
var wrtc = require( 'wrtc' );

var network = require( './server/network.js' );
var sendToClientsJSON = network.sendToClientsJSON;
var sendToClientsJSONBinary = network.sendToClientsJSONBinary;

var fs = require( 'fs' );


// - Global variables -

var serverConfig = null;

// App

var app = null;
var httpServer = null;
var wss = null;

var isAppEnding = false;

// USB Connection (video) variables

var videoChildProcess = null;
var videoConnected = false;

// Current screen state

var videoIsValid = false;
var framesToVideoValid = 2;
var firstModeChange = true;

var modes = { };
var videoBuffers = { };

var initialMode = {
	modeWord: 0xE000,
	wordsPerPixel: 1,
	xResolution: 320,
	yResolution: 240,
	flipX: false,
	flipY: false,
	rot: 0,
	aspect: 320 / 240,
	canvas: null,
	canvasCtx: null
};

var currentMode = initialMode;

var currentModeWord = currentMode.modeWord;
var xResolution = currentMode.xResolution;
var yResolution = currentMode.yResolution;
var aspect = currentMode.aspect;

var modeWordSet = currentModeWord;
var xResolutionSet = xResolution;
var yResolutionSet = yResolution;

var imageData = null;
var currentPixelByte = 0;

// UART Peripherals variables

var serialPort = null;

var serialFrameSize = 5 + 2;
var serialWriteBuffer = [ ];
for ( var i = 0; i < serialFrameSize; i++ ) {

	serialWriteBuffer[ i ] = 0;

}

var joy1DirectionsByte = 0xF0;
var joy2DirectionsByte = 0x0F;
var joy1Buttons = 0xFF;
var joy2Buttons = 0xFF;

var maxPS2Bytes = 255;
var keybWriteBuffer = null;
var currentKeybBytes = 0;
var mouseWriteBuffer = null;
var currentMouseBytes = 0;

// Time
var currentTimeFormat = 0;
var timeHasChanged = true;
var zxSpectrumRTCRegisters = [ ];
for ( var i = 0; i < 8; i++ ) {

	zxSpectrumRTCRegisters[ i ] = 0;

}

// Audio

var audioChildProcess = null;
var audioConnected = false;
var micAudioSource = null;
var micMediaStreamTrack = null;
var micMediaStream = null;

// Save to disk

var videoFileStream = null;
var audioFileStream = null;
var numFramesSaved = 0;
var audioFilePath;

// - Main code -

initServer();

// - End of main code -


// - Functions -

function initServer() {

	process.on( "SIGINT", function() {

		console.log( "  SIGINT Signal Received, shutting down" );

		beginAppTermination();

	} );

	// Load config
	serverConfig = JSON.parse( fs.readFileSync( "./EnsaimediaConfig.json", "latin1" ) );
	if ( serverConfig === null ) {

		console.log( "Error loading config file EnsaimediaConfig.json. Please check its syntax." );
		process.exit( 0 );

	}

	openFilesSaveToDisk();

	connectVideoProcess();

	connectAudioProcess();

	connectSerial( function serialConnected () {

		network.startServer( serverConfig.listenPort, function networkStarted() {

			console.log( "Server started listening on port: " + serverConfig.listenPort + ", you can start web browser at http://127.0.0.1:" + serverConfig.listenPort + "/main.html " );

		}, onClientConnected, onClientDisconnected, onClientMessage );

	} );

}

function beginAppTermination() {

	if ( videoConnected ) {

		isAppEnding = true;
		videoIsValid = false;

		disconnectVideoProcess();

	}
	else {

		finish();

	}

}

function finish() {

	disconnectSerial( function () {

		closeFilesSaveToDisk();

		console.log( "Ensaimedia terminated successfully. Have a nice day." );

		process.exit( 0 );

	} );

}

function openFilesSaveToDisk() {

	var audioOn = serverConfig.audioEnabled && serverConfig.saveAudioToDiskEnabled;

	if ( ( ! serverConfig.saveVideoToDiskEnabled ) && ( ! audioOn ) ) {

		return;

	}

	var date = new Date();
	var s = date.getSeconds();
	var m = date.getMinutes();
	var h = date.getHours();
	var d = date.getDate();
	var mo = date.getMonth() + 1;
	var y = date.getFullYear();
	var saveDir = serverConfig.saveToDiskPath + y + "_" + mo + "_" + d + "_" + h + "_" + m + "_" + s + "/";

	fs.mkdirSync( saveDir );

	var videoFilePath = saveDir + "video.bin";
	audioFilePath = saveDir + "audio.wav";

	if ( serverConfig.saveVideoToDiskEnabled ) {

		videoFileStream = fs.createWriteStream( videoFilePath, { encoding: null } );

	}

	if ( audioOn ) {

		audioFileStream = fs.createWriteStream( audioFilePath, { encoding: null } );

		// Save wav header
		audioFileStream.write( getWAVHeader( serverConfig.audioStereo ? 2 : 1, serverConfig.audioFramesPerSecond, 2 ) );

	}

}

function closeFilesSaveToDisk() {

	if ( videoFileStream ) {

		videoFileStream.end();

	}

	if ( audioFileStream ) {

		audioFileStream.end();
		finishAudioFile();

	}

}

function finishAudioFile() {

	// Write length of sample data in bytes to WAV file header

	var numBytes = getWAVSampleByteCount( serverConfig.audioStereo ? 2 : 1, 2, numFramesSaved );

	var byteLengthBuffer = Buffer.alloc( 4 );
	var byteLengthBufferView = new DataView( byteLengthBuffer.buffer );
	var byteLengthBuffer36 = Buffer.alloc( 4 );
	var byteLengthBuffer36View = new DataView( byteLengthBuffer36.buffer );

	byteLengthBufferView.setInt32( 0, numBytes, true );
	byteLengthBuffer36View.setInt32( 0, numBytes + 36, true );

	var fd = fs.openSync( audioFilePath, "r+" );

	fs.writeSync( fd, byteLengthBuffer36, 0, 4, 4 );
	fs.writeSync( fd, byteLengthBuffer, 0, 4, 40 );

	fs.closeSync( fd );

}

function getWAVHeader( numChannels, framesPerSecond, bytesPerSample ) {


	var blockAlign = numChannels * bytesPerSample;
	var bytesPerSecond = framesPerSecond * blockAlign;
	var bitsPerSample = bytesPerSample * 8;

	var header = Buffer.alloc( 44 );
	var headerView = new DataView( header.buffer );

	// "RIFF"
	headerView.setUint32( 0, 0x52494646, false );

	// Chunksize. Set afterwards
	headerView.setUint32( 4, 36, true );

	// "WAVE"
	headerView.setUint32( 8, 0x57415645, false );

	// "fmt "
	headerView.setUint32( 12, 0x666d7420, false );

	// Subchunk1size
	headerView.setUint32( 16, 16, true );

	// Audio format (PCM = 1)
	headerView.setUint16( 20, 1, true );

	// Num channels
	headerView.setUint16( 22, numChannels, true );

	// Sample rate
	headerView.setUint32( 24, framesPerSecond, true );

	// Byte rate
	headerView.setUint32( 28, bytesPerSecond, true );

	// Block align
	headerView.setUint16( 32, blockAlign, true );

	// Bits per sample
	headerView.setUint16( 34, bitsPerSample, true );

	// "data"
	headerView.setInt32( 36, 0x64617461, false );

	// Length of sample data in bytes, set afterwards. Set 0 here
	headerView.setUint32( 40, 0, true );

	return header;

}

function getWAVSampleByteCount( numChannels, bytesPerSample, numFrames ) {

	return numFrames * numChannels * bytesPerSample;

}

function connectVideoProcess() {

	videoChildProcess = child_process.spawn( "./fx2pipe-0.8/fx2pipe/fx2pipe", [ "-iws", "ifclk=x" ], { stdio: [ 'ignore', 'pipe', 'pipe'] } );

	videoChildProcess.stdout.on( 'data', processVideoData );

	videoChildProcess.stderr.setEncoding( 'utf8' );
	videoChildProcess.stderr.on( 'data', ( data ) => {

		//console.log( data );

	} );

	videoChildProcess.on( 'close', ( code ) => {

		videoConnected = false;

		if ( isAppEnding ) {

			disconnectAudioProcess();

		}
		else {

			sendToClientsJSON( "{\"type\":\"ensaimNovideo\"}" );
			console.log( "Video disconnected." );

		}

	} );

	console.log( "Video connected." );

	videoConnected = true;

}

function disconnectVideoProcess() {

	videoChildProcess.kill( 'SIGINT' );

}

function getMode( modeWord, xRes, yRes ) {

	return modes[ "" + ( modeWord >> 2 ).toString( 16 ) + "_" + xRes + "_" + yRes ];

}

function addMode( mode ) {

	modes[ "" + ( mode.modeWord >> 2 ).toString( 16 ) + "_" + mode.xResolution + "_" + mode.yResolution ] = mode;

}

function createVideoBuffer( mode ) {

	var buffer = Buffer.alloc( 2 * mode.wordsPerPixel * mode.xResolution * mode.yResolution );

	videoBuffers[ mode ] = buffer;

	return buffer;

}

function getVideoBuffer( mode ) {

	return videoBuffers[ mode ];

}

function processVideoData( data ) {

	if ( isAppEnding ) {

		return;

	}

	if ( videoFileStream && videoIsValid ) {

		// Save to file
		videoFileStream.write( Buffer.from( data ) );

	}

	for ( var i = 0, n = data.length - 1;  i < n; i += 2 ) {

		var b0 = data[ i ]
		var b1 = data[ i + 1 ];

		var word = b0 | ( b1 << 8 );

		if ( word & 0x8000 ) {

			var msb3 = word & 0xE000;

			switch ( msb3 ) {

				case 0x8000:

					if ( word === 0x8000 ) {

						// Command: START_FRAME

						// Paint/process previous image

						if ( videoIsValid ) {

							// Send to clients
							sendToClientsJSONBinary( "{\"type\":\"ensaimFrame\"}", imageData );

						}
						else {

							if ( -- framesToVideoValid <= 0 ) {

								videoIsValid = true;

							}
						}

						if ( firstModeChange ) {

							firstModeChange = false;
							continue;

						}

						// Video mode change
						if ( modeWordSet !== currentModeWord ||
							 xResolutionSet !== xResolution ||
							 yResolutionSet !== yResolution ) {

							var newMode = getMode( modeWordSet, xResolutionSet, yResolutionSet );

							if ( ! newMode ) {

								newMode = {
									modeWord: modeWordSet,
									wordsPerPixel: 1,
									xResolution: xResolutionSet,
									yResolution: yResolutionSet,
									flipX: false,
									flipY: false,
									rot: 0,
									aspect: xResolutionSet / yResolutionSet
								};

								addMode( newMode );

								createVideoBuffer( newMode );

								console.log( "New graphic mode: " + xResolutionSet + "x" + yResolutionSet );

							}

							currentModeWord = newMode.modeWord;
							xResolution = newMode.xResolution;
							yResolution = newMode.yResolution;
							aspect = newMode.aspect;

							imageData = getVideoBuffer( newMode );
							imageData.fill( 0 );

							currentMode = newMode;

							sendToClientsJSON( JSON.stringify( {
								type: "ensaimModeChange",
								newMode: newMode
							} ) );

							/*
							videoIsValid = false;
							framesToVideoValid = 1;
							*/
							/*
							if ( ! videoIsValid ) {

								framesToVideoValid ++;

							}
							*/

						}

						// Start new image
						currentPixelByte = 0;

					}
					break;

				case 0xA000:

					// Command: Set X Resolution
					xResolutionSet = ( word & 0x1FFF ) + 1;

					break;

				case 0xC000:

					// Command: Set Y Resolution
					yResolutionSet = ( word & 0x1FFF ) + 1;

					break;

				case 0xE000:

					// Command: Set screen mode
					modeWordSet = word & 0x1FFF;

					break;

				default:
					break;

			}

		}
		else if ( videoIsValid && imageData ) {

			imageData[ currentPixelByte++ ] = b0;
			imageData[ currentPixelByte++ ] = b1;

		}

	}

}

function connectSerial( onSerialConnected ) {

	serialPort = new SerialPort( serverConfig.serialPortFilePath, { baudRate: 115200 }, ( err ) => {

		if ( err ) {

			console.log( "Error opening port " + serverConfig.serialPortFilePath + ". Couldn't find the port or it was already in use, or insufficient privileges." );
			serialPort = null;
			return;

		}

		var parser = serialPort.pipe( new SerialPort.parsers.ByteLength( { length: 1 } ) );

		parser.on( 'data', function ( msg ) {

			if ( isAppEnding ) {

				return;

			}

			var response = msg[ 0 ];

			if ( ( response & 0xFC ) !== 0xA0 ) {

				console.log( "Serial error: " + response.toString( 16 ) );
				return;

			}

			selectTimeFormat( response & 0x03 );

			setTimeout( function () {

				sendSerialPacket();

			}, 33 );

			setInterval( function () {

				timeHasChanged = true;

			}, 1000 );

		} );

		setTimeout( function () {

			sendSerialPacket();

		}, 1000 );

		console.log( "Serial port opened at: " + serverConfig.serialPortFilePath );

		if ( onSerialConnected ) {

			onSerialConnected();

		}

	} );


	serialPort.on( 'close', ( err ) => {

		if ( err && err.disconnected === true ) {

			console.log( "Serial port abnormally closed at: " + serverConfig.serialPortFilePath + " ." );

			beginAppTermination();

		}

		serialPort = null;

	} );

}

function disconnectSerial( onClosed ) {

	if ( serialPort ) {

		serialPort.drain( () => {

			serialPort.close( function () {

				serialPort = null;

				if ( onClosed ) {

					onClosed();

				}

			} );

		} );

	}
	else {

		if ( onClosed ) {

			onClosed();

		}

	}

}

function sendSerialPacket() {

	if ( ! serialPort ) {

		return;

	}

	// Prepare packet

	serialWriteBuffer[ 0 ] = 0x34;
	serialWriteBuffer[ 1 ] = 0x60 | ( timeHasChanged ? currentTimeFormat : 0 );
	serialWriteBuffer[ 2 ] = joy1DirectionsByte & joy2DirectionsByte;
	serialWriteBuffer[ 3 ] = joy1Buttons;
	serialWriteBuffer[ 4 ] = joy2Buttons;

	serialWriteBuffer[ 5 ] = currentKeybBytes;
	serialWriteBuffer[ 6 ] = currentMouseBytes;

	var writeArray = serialWriteBuffer;

	if ( currentKeybBytes > 0 ) {

		writeArray = writeArray.concat( keybWriteBuffer );

		keybWriteBuffer = null;
		currentKeybBytes = 0;

	}

	if ( currentMouseBytes > 0 ) {

		writeArray = writeArray.concat( mouseWriteBuffer );

		mouseWriteBuffer = null;
		currentMouseBytes = 0;

	}

	if ( currentTimeFormat !== 0 && timeHasChanged ) {

		writeArray = writeArray.concat( getTime() );

		timeHasChanged = false;

	}

	serialPort.write( writeArray );

}

function selectTimeFormat( format ) {

	if ( Number.isInteger( format ) && format >= 0 && format <= 3 ) {

		currentTimeFormat = format;

	}

}

function convertToBCD( number ) {

	var digit0 = number % 10;
	var digit1 = Math.floor( number / 10 ) % 10;

	return ( ( digit1 & 0x0F ) << 4 ) | ( digit0 & 0x0F );

}

function getTime() {

	// Returns the sequence of bytes to be sent as an array of numbers, depending on current format

	switch ( currentTimeFormat ) {

		case 0:

			// No time format
			return [ ];

		break;

		case 1:

			// ZX Spectrum Divmmc RTC242X chip time format:

			var date = new Date();
			var s = date.getUTCSeconds();
			var m = date.getUTCMinutes();
			var h = date.getUTCHours();
			var d = date.getUTCDate();
			var mo = date.getUTCMonth() + 1;
			var y = date.getUTCFullYear();
			// Day of week, 0 = Sunday
			var w = date.getUTCDay();

			zxSpectrumRTCRegisters[ 0 ] = convertToBCD( s );
			zxSpectrumRTCRegisters[ 1 ] = convertToBCD( m );
			zxSpectrumRTCRegisters[ 2 ] = convertToBCD( h );
			zxSpectrumRTCRegisters[ 3 ] = convertToBCD( d );
			zxSpectrumRTCRegisters[ 4 ] = convertToBCD( mo );
			zxSpectrumRTCRegisters[ 5 ] = convertToBCD( y );
			zxSpectrumRTCRegisters[ 6 ] = convertToBCD( w );
			zxSpectrumRTCRegisters[ 7 ] = 0;

			return zxSpectrumRTCRegisters;

		break;

		case 2:

			var timeMS = Date.now();

			// 64 bit timestamp. In JS it is only 53 bits
			return [ 0, 0, 0, 0, ( timeMS & 0xFF000000 ) >> 24, ( timeMS & 0x00FF0000 ) >> 16, ( timeMS & 0x0000FF00 ) >> 8, timeMS & 0x000000FF ];

		break;

		case 3:

			// User defined format. Zero terminated byte sequence.
			// Not implemented, to be implemented by the user.
			// Here we send a 0 to terminate the byte string
			return [ 0 ];

		break;

		default:
			return [];
		break;

	}

}

function connectAudioProcess() {

	if ( ! serverConfig.audioEnabled ) {

		console.log( "Not enabling audio since it is disabled in the config." );
		return;

	}

	// Audio parameters
	var sampleRate = serverConfig.audioFramesPerSecond;
	var audioChannels = serverConfig.audioStereo ? 2 : 1;

	var numberOfFrames = Math.floor( sampleRate / 100 );
	var samples = new Int16Array( numberOfFrames * audioChannels );
	var samplesView = new DataView( samples.buffer );

	var audioData = {
		samples: samples,
		sampleRate: sampleRate,
		bitsPerSample: 16,
		channelCount: audioChannels,
		numberOfFrames: numberOfFrames
	};

	micAudioSource = new wrtc.nonstandard.RTCAudioSource();
	micMediaStreamTrack = micAudioSource.createTrack();
	micMediaStream = new wrtc.MediaStream( [ micMediaStreamTrack ] );

	// Number of frames left to fill in the buffer
	var numFramesLeftWrite = numberOfFrames;
	var pWrite = 0;

	function processAudioData( data ) {

		// The divisor is ( 2 * numChannels ), 2 bytes (16 bits) per sample, by number of channels.
		var numNewFrames = data.length >> audioChannels;
		var numFramesLeftRead = numNewFrames;

		var pRead = 0;
		while ( numFramesLeftRead > 0 ) {

			var consumedFrames = Math.min( numFramesLeftRead, numFramesLeftWrite );
			numFramesLeftRead -= consumedFrames;
			numFramesLeftWrite -= consumedFrames;

			for ( var i = 0, n = consumedFrames * 2 * audioChannels; i < n; i ++ ) {

				samplesView.setInt8( pWrite ++, data[ pRead ++ ] );

			}

			if ( numFramesLeftWrite === 0 ) {

				micAudioSource.onData( audioData );

				numFramesLeftWrite = numberOfFrames;
				pWrite = 0;

			}

		}

		if ( audioFileStream && videoIsValid ) {

			audioFileStream.write( data );
			numFramesSaved += numNewFrames;

		}

	}

	audioChildProcess = child_process.spawn( "arecord", [
		"-D", "" + serverConfig.audioDevice,
		"-c", "" + audioChannels,
		"-r", "" + sampleRate,
		"-f", "S16_LE",
		"--buffer-size=" + numberOfFrames
	], { stdio: [ 'ignore', 'pipe', 'pipe'] } );

	audioChildProcess.stdout.on( 'data', processAudioData );

	audioChildProcess.stderr.setEncoding( 'utf8' );
	audioChildProcess.stderr.on( 'data', ( data ) => {

		console.log( "Audio message: " + data );

	} );

	audioChildProcess.on( 'close', ( code ) => {

		audioConnected = false;

		if ( isAppEnding ) {

			finish();

		}
		else {

			console.log( "Audio disconnected." );

		}

		audioChildProcess = null;

	} );

	audioConnected = true;

	console.log( "Audio input connected." );

}

function disconnectAudioProcess() {

	if ( audioChildProcess ) {

		audioChildProcess.kill( 'SIGINT' );

	}
	else {

		finish();

	}

}

function onClientConnected( client ) {

	if ( audioChildProcess ) {

		// Start peer to send audio stream over WebRTC
		client.peer = new Peer( {
			initiator: true,
			trickle: false,
			config: {
				//iceServers: [ { urls: 'stun:stun.l.google.com:19302' } ],
				/*
				portRange: {
					min: 8100,
					max: 8200
				}*/
			},

			wrtc: wrtc
		} );

		client.peer.addStream( micMediaStream );

		/*
		client.peer.on( 'connect', function () {

			console.log( "Peer connected" );

		} );
		*/

		// WebRTC signaling
		client.peer.on( 'signal', function ( signal ) {

			client.socket.send( JSON.stringify( signal ), function nop () {} );

		} );

		client.peer.on( 'error', function ( signal ) {

			console.log( "Error connecting via RTC to client" );

		} );

		client.peer.on( 'close', function ( signal ) {

			client.peer.destroy();
			client.peer = null;

		} );

	}

	// Send mesage with current number of clients
	sendToClientsJSON( JSON.stringify( {
		type: "ensaimNumClients",
		numClients: network.getNumClients()
	} ) );

	if ( videoIsValid ) {

		// Send initial video mode message to client
		client.socket.send( JSON.stringify( {
			type: "ensaimModeChange",
			newMode: currentMode
		} ), function nop () {} );

	}

}

function onClientDisconnected( client ) {

	if ( client.peer ) {

		client.peer.destroy();
		client.peer = null;

	}

	// Send mesage with current number of clients
	sendToClientsJSON( JSON.stringify( {
		type: "ensaimNumClients",
		numClients: network.getNumClients()
	} ) );

}

function onClientMessage( client, message ) {

	//if ( msg instanceof ArrayBuffer ) { // binary. not tested

	var data = JSON.parse( message );

	if ( data ) {

		switch ( data.type ) {

			case 'ensaimPeriph':

				joy1DirectionsByte = data.joy1DirByte;
				joy2DirectionsByte = data.joy2DirByte;
				joy1Buttons = data.joy1Buttons;
				joy2Buttons = data.joy2Buttons;

				if ( data.keybBytes ) {

					if ( keybWriteBuffer === null && data.keybBytes.length <= maxPS2Bytes ) {

						keybWriteBuffer = data.keybBytes;

					}
					else if ( data.keybBytes.length + keybWriteBuffer.length <= maxPS2Bytes ) {

						keybWriteBuffer = keybWriteBuffer.concat( data.keybBytes );

					}

					currentKeybBytes = keybWriteBuffer.length;

				}

				if ( data.mouseBytes ) {

					if ( mouseWriteBuffer === null && data.mouseBytes.length <= maxPS2Bytes ) {

						mouseWriteBuffer = data.mouseBytes;

					}
					else if ( data.mouseBytes.length + mouseWriteBuffer.length <= maxPS2Bytes ) {

						mouseWriteBuffer = mouseWriteBuffer.concat( data.mouseBytes );

					}

					currentMouseBytes = mouseWriteBuffer.length;

				}

				break;

			default:

				// Assumed to be a WebRTC signaling message
				if ( client.peer ) {

					client.peer.signal( data );

				}

				//console.log( "WebRTC message: " );
				//console.log( data );

				break;

		}

	}

}
