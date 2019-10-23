
// - Requires -

var child_process = require( 'child_process' );

var files = require( "./server/files.js" );

var fs = require( 'fs' );

var PNG = require( 'pngjs' ).PNG;

// - Global variables -

var isAppEnding = false;
var currentFrameCallback = null;

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

// Audio


// Look-up tables for Spectrum ZX-Uno screen mode

var zxLookupR = [];
var zxLookupG = [];
var zxLookupB = [];

for ( var i = 0; i < 512; i++ ) {

	zxLookupR[ i ] = Math.round( ( ( i & 0x01C0 ) >> 6 ) * ( 255 / 7 ) );
	zxLookupG[ i ] = Math.round( ( ( i & 0x0038 ) >> 3 ) * ( 255 / 7 ) );
	zxLookupB[ i ] = Math.round( ( i & 0x0007 ) * ( 255 / 7 ) );

}


// - Main code -

if ( process.argv.length < 4 ) {

	printUsage();

	process.exit( 1 );

}

var directory = process.argv[ 2 ];
var interlaced = process.argv[ 3 ] === 'i';
var videoFPS = parseFloat( process.argv[ 4 ] );
var scale = parseFloat( process.argv[ 5 ] );

if ( isNaN( videoFPS ) ) {

	console.log( "" );
	console.log( "Error: FPS value not understood. ");
	console.log( "" );

	printUsage();

	process.exit( 1 );

}

if ( isNaN( scale ) ) {

	scale = 4;

}

if ( interlaced ) {

	console.log( "Using interlaced mode" );

}

process.on( "SIGINT", function() {

	console.log( "Terminating by user request..." );

	isAppEnding = true;

} );

convertCapture( "./savedSessions/", directory + "/", function () {

	console.log( "" );
	console.log( "Done." );

} );


// - End of main code -


// - Functions -

function printUsage() {

	console.log( "" );
	console.log( "Usage: node convertCaptures.js <directory> INTERLACED FPS [SCALE=4]" );
	console.log( " This program converts the raw captures of Ensaimedia in webm video with audio." );
	console.log( "Parameters:" );
	console.log( "\t<directory>: Directory with the capture to process, under ensaimedia/savedSessions/" );
	console.log( "\tINTERLACED: i for interlaced, ni for not interlaced. Interlaced videos will have half the frames. You don't need to divide by 2 the FPS." );
	console.log( "\tFPS: Number of Frames Per Second of the input video, with decimals." );
	console.log( "\tSCALE: (optional) Scale up the video resolution by this amount. Default = 4" );

}

function convertCapture( basePath, captureDir, onCaptureConverted ) {

	console.log( "" );
	console.log( "Processing capture " + captureDir );
	console.log( "" );

	var captureDirComplete = basePath + captureDir;

	var audioFilePath = captureDirComplete + "audio.wav";

	var adjustLength = 0;
	if ( fs.existsSync( audioFilePath ) ) {

		adjustLength = getWAVLength( audioFilePath );

	}

	convertVideoFile( captureDirComplete, adjustLength, function () {

		onCaptureConverted();

	} );

}

function convertVideoFile( dir, adjustLength, onVideoConverted ) {

	var videoFilePath = dir + "video.bin";

	if ( ! fs.existsSync( videoFilePath ) ) {

		console.log( "Capture video.bin file not found, skipping..." );

		onVideoConverted();

		return;

	}

	console.log( "Scanning video file..." );

	getVideoSize( videoFilePath, function ( videoSize ) {

		console.log( "Video contains " + videoSize.numFrames + " frames with max resolution of " + videoSize.x + " x " + videoSize.y );

		console.log( "Converting video to .png images..." );

		var imagesPath = dir + "frames/";

		if ( ! fs.existsSync( imagesPath ) ) {

			fs.mkdirSync( imagesPath );

		}

		var numProcessedFrames = 0;
		var frameIndex = 0;
		var saveOptions = { colorType: 6 };
		var numDigits = Math.ceil( Math.log10( videoSize.numFrames ) );
		var bitmap = null;
		var bitmap2 = null;

		function videoConversionFrameCallback( videoMode, frameData ) {

			var numPixels = videoMode.xResolution * videoMode.yResolution;
			var numBytes = numPixels * 4;

			if ( ! bitmap || bitmap.length !== numBytes ) {

				bitmap = Buffer.alloc( numBytes );
				bitmap2 = Buffer.alloc( numBytes );

			}

			nativeScreenToRGB24FunctionModeSpectrum( frameData, bitmap, videoMode );

			function saveFrame() {

				var png = new PNG( {
					width: videoMode.xResolution,
					height: videoMode.yResolution,
					bitDepth: 8,
					colorType: 6,
					inputColorType: 6,
					inputHasAlpha: true
				} );

				png.data = bitmap;

				var pngFileData = PNG.sync.write( png, saveOptions );

				frameIndex ++;
				var pngFileName = "" + ( frameIndex );
				/*
				while ( pngFileName.length < numDigits ) {
					pngFileName = "0" + pngFileName;
				}
				*/

				fs.writeFileSync( imagesPath + pngFileName + ".png", pngFileData );

			}

			if ( interlaced ) {

				if ( ( numProcessedFrames & 1 ) === 0 ) {

					bitmap.copy( bitmap2 );

				}
				else {

					// Mix 2 frames
					var p = 0;
					for ( var i = 0; i < numPixels; i++ ) {

						bitmap[ p ] = Math.floor( ( bitmap[ p ] + bitmap2[ p ] ) * 0.5 );
						bitmap[ p + 1 ] = Math.floor( ( bitmap[ p + 1 ] + bitmap2[ p + 1 ] ) * 0.5 );
						bitmap[ p + 2 ] = Math.floor( ( bitmap[ p + 2 ] + bitmap2[ p + 2 ] ) * 0.5 );
						bitmap[ p + 3 ] = 255;

						p += 4;

					}

					saveFrame();

				}

			}
			else {

				saveFrame();

			}

			numProcessedFrames ++;

		}

		processVideoFile( videoFilePath, videoConversionFrameCallback, function () {

			// Sync the audio by inserting frames

			syncAudio( numProcessedFrames, adjustLength, videoFPS, imagesPath );

			// Use ffmpeg to create a webm video from png frames and wav audio

			var scaledResX = Math.floor( videoSize.x * scale );
			var scaledResY = Math.floor( videoSize.y * scale );

			var params = null;
			if ( adjustLength !== 0 ) {

				// Audio

				params = [
					"-framerate",
					"" + videoFPS,
					"-i",
					dir + "frames/f%d.png",
					"-i",
					dir + "audio.wav",
					"-vf",
					"scale=" + scaledResX + ":" + scaledResY,
					"-sws_flags",
					"neighbor",
					"-sws_dither",
					"none",
					"-c:v",
					"libvpx-vp9",
					"-pix_fmt",
					"yuva420p",
					"-lossless",
					"1",
					dir + "video.webm"
				];

			}
			else {

				// No audio

				params = [
					"-framerate",
					"" + videoFPS,
					"-i",
					dir + "frames/f%d.png",
					"-vf",
					"scale=" + scaledResX + ":" + scaledResY,
					"-sws_flags",
					"neighbor",
					"-sws_dither",
					"none",
					"-c:v",
					"libvpx-vp9",
					"-pix_fmt",
					"yuva420p",
					"-lossless",
					"1",
					dir + "video.webm"
				];

			}

			console.log( "Launching ffmpeg to generate webm video..." );

			var ffmpegProcess = child_process.spawn( "ffmpeg", params, { stdio: [ 'inherit', 'inherit', 'inherit'] } );

			ffmpegProcess.on( 'close', ( code ) => {

				onVideoConverted();

			} );

		} );

	} );

}

function syncAudio( numProcessedFrames, adjustLength, videoFPS, imagesPath ) {

	numProcessedFrames = Math.floor( numProcessedFrames * ( interlaced ? 0.5 : 1 ) );
	var syncedFrames = Math.floor( adjustLength * videoFPS * ( interlaced ? 0.5 : 1 ) );
	var newFrames = syncedFrames - numProcessedFrames;

	var outputFrameIndex = 1;
	var accum = 0;

	if ( ( adjustLength !== 0 ) && ( newFrames >= 1 ) ) {

		console.log( "Adjusting video length to " + adjustLength + " seconds by inserting " + newFrames + " frames..." );

		for ( var i = 1; i <= numProcessedFrames; i ++ ) {

			var imagePath = imagesPath + i + ".png";
			var outImagePath = imagesPath + "f" + ( outputFrameIndex ++ ) + ".png";
			fs.renameSync( imagePath, outImagePath );

			accum += newFrames;

			while ( accum >= numProcessedFrames ) {

				// Insert frame

				var copyImagePath = imagesPath + "f" + ( outputFrameIndex ++ ) + ".png";
				fs.copyFileSync( outImagePath, copyImagePath );

				accum -= numProcessedFrames;

			}

		}

	}
	else {

		console.log( "Reenumerating frames..." );

		for ( var i = 1; i <= numProcessedFrames; i ++ ) {

			var imagePath = imagesPath + i + ".png";
			var outImagePath = imagesPath + "f" + ( outputFrameIndex ++ ) + ".png";
			fs.renameSync( imagePath, outImagePath );

		}

	}

}

function getWAVLength( audioFilePath ) {

	var fd = fs.openSync( audioFilePath );

	var buf16 = Buffer.alloc( 2 );
	var buf16View = new DataView( buf16.buffer );
	var buf32 = Buffer.alloc( 4 );
	var buf32View = new DataView( buf32.buffer );

	fs.readSync( fd, buf32, 0, 4, 24 );
	var framesPerSecond = buf32View.getUint32( 0, true );

	fs.readSync( fd, buf16, 0, 2, 32 );
	var bytesPerFrame = buf16View.getUint16( 0, true );

	fs.readSync( fd, buf32, 0, 4, 40 );
	var lengthInBytes = buf32View.getUint32( 0, true );

	fs.closeSync( fd );

	var numFrames = Math.floor( lengthInBytes / bytesPerFrame );

	return numFrames / framesPerSecond;

}

function getVideoSize( videoFilePath, onFinished ) {

	var maxXRes = 0;
	var maxYRes = 0;
	var numFrames = 0;

	function videoSizeFrameCallback( videoMode, frameData ) {

		if ( videoMode.xResolution > maxXRes ) {

			maxXRes = videoMode.xResolution;

		}

		if ( videoMode.yResolution > maxYRes ) {

			maxYRes = videoMode.yResolution;

		}

		numFrames ++;

	}

	processVideoFile( videoFilePath, videoSizeFrameCallback, function () {

		onFinished( { x: maxXRes, y: maxYRes, numFrames: numFrames } );

	} );

}

function processVideoFile( videoFilePath, frameCallback, onFinished ) {

	currentFrameCallback = frameCallback;

	initVideoState();

	var readStream = fs.createReadStream( videoFilePath, { encoding: null } );
	readStream.on( 'data', processVideoData );
	readStream.on( 'end', function () {

		currentFrameCallback = null;
		onFinished();

	} );

}

function nativeScreenToRGB24FunctionModeSpectrum( data, output, mode ) {

	var channel = 0;
	for ( var i = 0, n = data.length; i < n; i += 2 ) {

		var b0 = data[ i ]
		var b1 = data[ i + 1 ];

		var word = ( b0 | ( b1 << 8 ) ) & 0x01FF;

		output[ channel++ ] = zxLookupR[ word ];
		output[ channel++ ] = zxLookupG[ word ];
		output[ channel++ ] = zxLookupB[ word ];
		output[ channel++ ] = 255;

	}

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

function initVideoState() {

	modes = { };
	videoBuffers = { };

	videoIsValid = false;
	framesToVideoValid = 2;
	firstModeChange = true;

	currentMode = initialMode;

	currentModeWord = currentMode.modeWord;
	xResolution = currentMode.xResolution;
	yResolution = currentMode.yResolution;
	aspect = currentMode.aspect;

	modeWordSet = currentModeWord;
	xResolutionSet = xResolution;
	yResolutionSet = yResolution;

	imageData = null;
	currentPixelByte = 0;

}

function processVideoData( data ) {

	if ( isAppEnding ) {

		return;

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

							currentFrameCallback( currentMode, imageData );

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

							}

							currentModeWord = newMode.modeWord;
							xResolution = newMode.xResolution;
							yResolution = newMode.yResolution;
							aspect = newMode.aspect;

							imageData = getVideoBuffer( newMode );
							imageData.fill( 0 );

							currentMode = newMode;

							videoIsValid = false;
							framesToVideoValid = 1;

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
