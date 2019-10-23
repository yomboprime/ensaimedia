
// - Global variables -

var guiSize = 20;
var guiWidth = 500;
var iconSize = 42;
var stats;


// Screen

var container = null;
var canvas = null;
var canvasCtx = null;
var imageData = null;
var xResolution = 320;
var yResolution = 240;
var aspect = 1;
var frameSize = 0;
var clientWidth = 0;
var clientHeight = 0;
var currentMode = null;
var videoValid = false;

var nativeScreenToRGB24Function = null;

var modes = { };

var interlacedCanvas0 = null;
var interlacedCanvasCtx0 = null;
var interlacedCanvas1 = null;
var interlacedCanvasCtx1 = null;
var interlacedOdd = false;

// GUI

var gui = null;
var currentGUIWindows = [];
var guiData = null;

var infoDiv = null;
var infoTextSpan = null;

// Look-up tables for Spectrum ZX-Uno screen mode

var zxLookupR = [];
var zxLookupG = [];
var zxLookupB = [];

for ( var i = 0; i < 512; i++ ) {

	zxLookupR[ i ] = Math.round( ( ( i & 0x01C0 ) >> 6 ) * ( 255 / 7 ) );
	zxLookupG[ i ] = Math.round( ( ( i & 0x0038 ) >> 3 ) * ( 255 / 7 ) );
	zxLookupB[ i ] = Math.round( ( i & 0x0007 ) * ( 255 / 7 ) );

}


// UART Peripherals variables

var maxPS2Bytes = 255;
var keybWriteBuffer = null;
var currentKeybBytes = 0;
var mouseWriteBuffer = null;
var currentMouseBytes = 0;

var previousMouseX = null;
var previousMouseY = null;

var joy1Controller = createController();
var joy2Controller = createController();

var controllersJoy1 = [ joy1Controller ];
var controllersJoy2 = [ joy2Controller ];

var connectedGamepads = [ ];
var joy1GamepadIndex = null;
var joy2GamepadIndex = null;


// Audio

var audioElement = null;


// Network

var socket = null;
var BINARY_STATE_IDLE = 0;
var BINARY_STATE_WAITING_FRAME = 1;
var BINARY_STATE_WAITING_AUDIO = 2;

var binaryState = BINARY_STATE_IDLE;

var peer = null;


// - Main client code -

init();


// - Functions -

function init() {

	changeFavicon( "favicon.png" );

	guiData = {
		viewOptions: {
			pixelated: true,
			interlaced: false,
			resolutionIsMultiple: true,
			showInfo: true
		},
		audioOptions: {
			audioEnabled: false,
			volume: 1
		},
		inputOptions: {
			keybEnabled: true,
			mouseEnabled: true,
			joysEnabled: true
		},
		systemOptions: {
		}
	};

	audioElement = document.getElementById( "audioElement" );

	container = document.createElement( 'div' );
	document.body.appendChild( container );

	canvas = createCanvas( xResolution, yResolution );
	attachMouseEventEmitter( canvas );
	aspect = xResolution / yResolution;
	canvasCtx = canvas.getContext( '2d' );

	interlacedCanvas0 = createCanvas( xResolution, yResolution );
	interlacedCanvasCtx0 = interlacedCanvas0.getContext( '2d' );

	interlacedCanvas1 = createCanvas( xResolution, yResolution );
	interlacedCanvasCtx1 = interlacedCanvas1.getContext( '2d' );

	canvasCtx.fillStyle = "green";
	canvasCtx.fillRect( 0, 0, xResolution, yResolution );

	stats = new Stats();
/*
 	stats.domElement.style.position = 'absolute';
 	stats.domElement.style.top = '0px';
 	stats.domElement.style.left = '0px';
	stats.domElement.style.display = 'block';
*/

	infoTextSpan = document.createElement( 'span' );
	infoTextSpan.style.color = "Silver";
	infoTextSpan.style.fontFamily = "Courier";
	infoTextSpan.innerText = "Not connected";

	infoDiv = document.createElement( 'div' );
	infoDiv.style.position = "absolute";
	infoDiv.style.top = "0px";
	infoDiv.style.left = "100px";

	infoDiv.appendChild( stats.domElement );
	infoDiv.appendChild( infoTextSpan );

	container.appendChild( infoDiv );
	container.appendChild( canvas );

	window.addEventListener( 'resize', onWindowResize, false );
	onWindowResize();

	attachKeyboardEventEmitter( window, getHTML5ToPS2KeyMap() );

	window.addEventListener( 'gamepadconnected', onGamepadConnected );
	window.addEventListener( 'gamepaddisconnected', onGamepadDisconnected );

	createGUI();

	initNetwork();

}

function onWindowResize() {

	// Layout video image

	var a = window.innerWidth;
	var b = Math.max( 0, window.innerHeight - guiSize );
	var aspectWindow = a / b;
	var width = b * aspect;
	var height = b;
	if ( aspect > aspectWindow ) {
		width = a;
		height = a / aspect;
	}
	if ( guiData.viewOptions.resolutionIsMultiple ) {

		var quotient = 1;
		if ( aspectWindow >= 1 ) {

			quotient = Math.floor( width / xResolution );

		}
		else {

			quotient = Math.floor( height / yResolution );

		}

		if ( quotient > 0 ) {

			width = xResolution * quotient;
			height = yResolution * quotient;

		}

	}

	canvas.style.width = width + "px";
	canvas.style.height = height + "px";
	canvas.style.left = ( a - width ) / 2 + "px";
	canvas.style.top = ( guiSize + ( b - height ) / 2 ) + "px";

	clientWidth = width;
	clientHeight = height;

}

function updateInfo() {

	infoTextSpan.innerText = "Connected clients: " + numConnectedClients + ( guiData.audioOptions.audioEnabled ? "." : ". Audio disabled." );

}

function toggleFullScreen() {

	if ( ! document.fullscreenElement ) {

		document.body.requestFullscreen().catch( err => {

			alert( 'Error attempting to enable full-screen mode.' );

		} );

	} else {

		document.exitFullscreen();

	}

}

function createCanvas( xRes, yRes ) {

	var canvas = document.createElement( 'canvas' );
	canvas.width = xRes;
	canvas.height = yRes;
	canvas.style.position = 'absolute';

	canvas.style.imageRendering = guiData.viewOptions.pixelated ? "pixelated" : "auto";

	return canvas;

}

function getMode( modeWord, xRes, yRes ) {

	return modes[ "" + ( modeWord >> 2 ).toString( 16 ) + "_" + xRes + "_" + yRes ];

}

function addMode( mode ) {

	modes[ "" + ( mode.modeWord >> 2 ).toString( 16 ) + "_" + mode.xResolution + "_" + mode.yResolution ] = mode;

}

function setPixelFunction( mode ) {

	var videoMode = ( mode.modeWord & 0x1FFF ) >> 4;

	switch ( videoMode ) {

		case 0:

			nativeScreenToRGB24Function = nativeScreenToRGB24FunctionModeSpectrum;

			break;

		default:

			alert( "Error: no suitable process function found for modeWord: " + videoMode );

			break;

	}

}

function nativeScreenToRGB24FunctionModeSpectrum( data, imageData, mode ) {

	var d = imageData.data;
	var channel = 0;
	for ( var i = 0, n = data.byteLength; i < n; i += 2 ) {

		var b0 = data[ i ]
		var b1 = data[ i + 1 ];

		var word = ( b0 | ( b1 << 8 ) ) & 0x01FF;

		d[ channel++ ] = zxLookupR[ word ];
		d[ channel++ ] = zxLookupG[ word ];
		d[ channel++ ] = zxLookupB[ word ];
		d[ channel++ ] = 255;

	}

}

function createGUI() {

	if ( gui ) {

		gui.destroy();

	}

	gui = new dat.GUI( { hideable: false } );

	gui.width = guiWidth;

	var viewOptions = gui.addFolder( "View options" );

	viewOptions.add( guiData.viewOptions, 'pixelated' ).name( 'Pixelated screen' ).onChange( function ( value ) {

		currentMode.canvas.style.imageRendering = value ? "pixelated" : "auto";

	} );

	viewOptions.add( guiData.viewOptions, 'interlaced' ).name( 'Interlaced' ).onChange( function ( value ) {

		interlacedOdd = false;

	} );

	viewOptions.add( guiData.viewOptions, 'resolutionIsMultiple' ).name( 'Resolution is multiple' ).onChange( function ( value ) {

		onWindowResize();

	} );

	viewOptions.add( guiData.viewOptions, 'showInfo' ).name( 'Show info on screen' ).onChange( function ( value ) {

		stats.domElement.style.display = value ? 'block' : 'none';
		infoTextSpan.style.display = value ? 'block' : 'none';

	} );

	var onToggleFullScreen = {

		onToggleFullScreen: toggleFullScreen

	};

	viewOptions.add( onToggleFullScreen, 'onToggleFullScreen' ).name( 'Toggle full-screen' );

	var audioOptions = gui.addFolder( "Audio options" );

	audioOptions.add( guiData.audioOptions, 'audioEnabled' ).name( 'Audio enabled' ).onChange( function ( value ) {

		if ( value ) {

			audioElement.play();

		}
		else {

			audioElement.pause();

		}

		updateInfo();

	} );

	var inputOptions = gui.addFolder( "Input options" );

	inputOptions.add( guiData.inputOptions, 'keybEnabled' ).name( 'Keyboard enabled' );
	inputOptions.add( guiData.inputOptions, 'mouseEnabled' ).name( 'Mouse enabled' );
	inputOptions.add( guiData.inputOptions, 'joysEnabled' ).name( 'Joysticks enabled' );

	gui.close();

	viewOptions.open();
	audioOptions.open();

}

function changeFavicon( src ) {

	// from http://stackoverflow.com/questions/260857/changing-website-favicon-dynamically
	var link = document.querySelector( "link[rel*='icon']" ) || document.createElement( 'link' );
	link.type = 'image/x-icon';
	link.rel = 'shortcut icon';
	link.href = src;
	document.getElementsByTagName( 'head' )[ 0 ].appendChild( link );

}

function createController() {

	return {
		x: 0,
		y: 0,
		buttons: 0xFF
	};

}

function createPS2Key( makeCode, extended ) {

	var key = {
		makeCode: makeCode,
		extended: extended,

		pressKeyCodes: [],
		releaseKeyCodes: [],

		pressed: false
	};

	if ( extended ) {

		key.pressKeyCodes.push( 0xE0 );
		key.releaseKeyCodes.push( 0xE0 );

	}

	key.pressKeyCodes.push( key.makeCode );

	key.releaseKeyCodes.push( 0xF0 );
	key.releaseKeyCodes.push( key.makeCode );

	return key;

}

function getHTML5ToPS2KeyMap() {

	var map = { };

	function add( eventString, makeCode, extended ) {

		map[ eventString ] = createPS2Key( makeCode, extended );

	}

	// PS/2 set 2

	add( 'Backquote', 0x0E, false );
	add( 'Digit1', 0x16, false );
	add( 'Digit2', 0x1E, false );
	add( 'Digit3', 0x26, false );
	add( 'Digit4', 0x25, false );
	add( 'Digit5', 0x2E, false );
	add( 'Digit6', 0x36, false );
	add( 'Digit7', 0x3D, false );
	add( 'Digit8', 0x3E, false );
	add( 'Digit9', 0x46, false );
	add( 'Digit0', 0x45, false );
	add( 'Minus', 0x4E, false );
	add( 'Equal', 0x55, false );
	add( 'Backspace', 0x66, false );
	add( 'Tab', 0x0D, false );
	add( 'KeyQ', 0x15, false );
	add( 'KeyW', 0x1D, false );
	add( 'KeyE', 0x24, false );
	add( 'KeyR', 0x2D, false );
	add( 'KeyT', 0x2C, false );
	add( 'KeyY', 0x35, false );
	add( 'KeyU', 0x3C, false );
	add( 'KeyI', 0x43, false );
	add( 'KeyO', 0x44, false );
	add( 'KeyP', 0x4D, false );
	add( 'BracketLeft', 0x54, false );
	add( 'BracketRight', 0x5B, false );
	add( 'CapsLock', 0x58, false );
	add( 'KeyA', 0x1C, false );
	add( 'KeyS', 0x1B, false );
	add( 'KeyD', 0x23, false );
	add( 'KeyF', 0x2B, false );
	add( 'KeyG', 0x34, false );
	add( 'KeyH', 0x33, false );
	add( 'KeyJ', 0x3B, false );
	add( 'KeyK', 0x42, false );
	add( 'KeyL', 0x4B, false );
	add( 'Semicolon', 0x4C, false );
	add( 'Quote', 0x52, false );
	add( 'Enter', 0x5A, false );
	add( 'ShiftLeft', 0x12, false );
	add( 'KeyZ', 0x1A, false );
	add( 'KeyX', 0x22, false );
	add( 'KeyC', 0x21, false );
	add( 'KeyV', 0x2A, false );
	add( 'KeyB', 0x32, false );
	add( 'KeyN', 0x31, false );
	add( 'KeyM', 0x3A, false );
	add( 'Comma', 0x41, false );
	add( 'Period', 0x49, false );
	add( 'Slash', 0x4A, false );
	add( 'ShiftRight', 0x59, false );
	add( 'ControlLeft', 0x14, false );
	add( 'AltLeft', 0x11, false );
	add( 'Space', 0x29, false );
	add( 'AltRight', 0x11, true );
	add( 'ControlRight', 0x14, true );
	add( 'Insert', 0x70, true );
	add( 'Delete', 0x71, true );
	add( 'ArrowLeft', 0x6B, true );
	add( 'Home', 0x6C, true );
	add( 'End', 0x69, true );
	add( 'ArrowUp', 0x75, true );
	add( 'ArrowDown', 0x72, true );
	add( 'PageUp', 0x7D, true );
	add( 'PageDown', 0x7A, true );
	add( 'ArrowRight', 0x74, true );
	add( 'NumLock', 0x77, false );
	add( 'Numpad7', 0x6C, false );
	add( 'Numpad4', 0x6B, false );
	add( 'Numpad1', 0x69, false );
	add( 'NumpadDivide', 0x4A, true );
	add( 'Numpad8', 0x75, false );
	add( 'Numpad5', 0x73, false );
	add( 'Numpad2', 0x72, false );
	add( 'Numpad0', 0x70, false );
	add( 'NumpadMultiply', 0x7C, false );
	add( 'Numpad9', 0x7D, false );
	add( 'Numpad6', 0x74, false );
	add( 'Numpad3', 0x7A, false );
	add( 'NumpadDecimal', 0x71, false );
	add( 'NumpadSubtract', 0x7B, false );
	add( 'NumpadAdd', 0x79, false );
	add( 'NumpadEnter', 0x5A, true );
	add( 'Escape', 0x76, false );
	add( 'F1', 0x05, false );
	add( 'F2', 0x06, false );
	add( 'F3', 0x04, false );
	add( 'F4', 0x0C, false );
	add( 'F5', 0x03, false );
	add( 'F6', 0x0B, false );
	add( 'F7', 0x83, false );
	add( 'F8', 0x0A, false );
	add( 'F9', 0x01, false );
	add( 'F10', 0x09, false );
	add( 'F11', 0x78, false );
	add( 'F12', 0x07, false );
//	add( 'PrintScreen doesnt work in web', 0x, false );
	add( 'ScrollLock', 0x7E, false );

	var keyPause = createPS2Key( 0, false );
	keyPause.pressKeyCodes = [ 0xE1, 0x14, 0x77, 0xE1 ];
	keyPause.releaseKeyCodes = [ 0xF0, 0x14, 0xF0, 0x77 ];
	map[ 'Pause' ] = keyPause;

	add( 'IntlBackslash', 0x5D, false );

	return map;

}

function attachKeyboardEventEmitter( element, keyMap ) {

	element.addEventListener( "keydown", function( event ) {

		if ( ! guiData.inputOptions.keybEnabled ) {

			return;

		}

		var key = keyMap[ event.code ];

		if ( key ) {

			if ( currentKeybBytes + key.pressKeyCodes.length <= maxPS2Bytes ) {

				if ( keybWriteBuffer === null ) {

					keybWriteBuffer = key.pressKeyCodes;

				}
				else {

					keybWriteBuffer = keybWriteBuffer.concat( key.pressKeyCodes );

				}

				currentKeybBytes += key.pressKeyCodes.length;

				key.pressed = true;

			}

		}

	} );

	element.addEventListener( "keyup", function( event ) {

		var key = keyMap[ event.code ];

		if ( key ) {

			if ( key.pressed ) {

				if ( currentKeybBytes + key.releaseKeyCodes.length <= maxPS2Bytes ) {

					if ( keybWriteBuffer === null ) {

						keybWriteBuffer = key.releaseKeyCodes;

					}
					else {

						keybWriteBuffer = keybWriteBuffer.concat( key.releaseKeyCodes );

					}

					currentKeybBytes += key.releaseKeyCodes.length;

					key.pressed = false;

				}

			}

		}

	} );

}

function attachMouseEventEmitter( element ) {

	function processMouseEvent ( event ) {

		if ( ! guiData.inputOptions.mouseEnabled ) {

			return;

		}

		if ( currentMouseBytes + 3 <= maxPS2Bytes ) {

			var canvas = event.target;

			// Normalized coordinates
			var xc = ( event.clientX / canvas.clientWidth );
			var yc = - ( event.clientY / canvas.clientHeight ) + 1;

			// Target system coordinates
			x = Math.max( 0, Math.min( xResolution - 1, Math.round( xc * xResolution ) ) );
			y = Math.max( 0, Math.min( yResolution - 1, Math.round( yc * yResolution ) ) );

			if ( previousMouseX === null ) {

				previousMouseX = x;
				previousMouseY = y;

			}

			var dxs = Math.min( 255, Math.max( -256, x - previousMouseX ) );
			var dys = Math.min( 255, Math.max( -256, y - previousMouseY ) );
			dx = ( dxs >= 0 ? dxs : dxs + 512 ) & 0x0FF;
			dy = ( dys >= 0 ? dys : dys + 512 ) & 0x0FF;

			var statusByte = ( dys < 0 ? 0x20 : 0 ) | ( dxs < 0 ? 0x10: 0 ) | 0x08 | ( event.buttons & 0x07 );

			if ( mouseWriteBuffer === null ) {

				mouseWriteBuffer = [ statusByte, dx, dy ];

			}
			else {

				mouseWriteBuffer = mouseWriteBuffer.concat( [ statusByte, dx, dy ] );

			}

			currentMouseBytes += 3;

			previousMouseX = x;
			previousMouseY = y;

		}

	}

	element.addEventListener( "mousedown", processMouseEvent );

	element.addEventListener( "mouseup", processMouseEvent );

	element.addEventListener( "mousemove", processMouseEvent );

}

function onGamepadConnected( e ) {

	var gamepad = e.gamepad;

	console.log( "Gamepad connected: " + gamepad.index + ", id:" + gamepad.id + ", num buttons: " + gamepad.buttons.length + ", num axes: " + gamepad.axes.length + ", mapping: " + gamepad.mapping + "." );

	for ( var i = 0, n = connectedGamepads.length; i < n; i ++ ) {

		if ( connectedGamepads[ i ].id === gamepad.id ) {

			return;

		}

	}

	if ( joy1GamepadIndex === null ) {

		joy1GamepadIndex = gamepad.index;

	}
	else if ( joy2GamepadIndex === null ) {

		joy2GamepadIndex = gamepad.index;

	}

	connectedGamepads.push( gamepad );

}

function onGamepadDisconnected( e ) {

	var gamepad = e.gamepad;

	console.log( "Gamepad disconnected, index: " + e.gamepad.index + ", id:" + e.gamepad.id );

	for ( var i = 0, n = connectedGamepads.length; i < n; i ++ ) {

		if ( connectedGamepads[ i ].id === gamepad.id ) {

			if ( joy1GamepadIndex === gamepad.index ) {

				joy1GamepadIndex = null;

			}
			else if ( hostGamepadMappingJoy2 === gamepad.index ) {

				joy2GamepadIndex = null;

			}

			connectedGamepads.splice( i, 1 );

			return;

		}

	}

}

function pollGamepad( gamepadIndex, controller ) {

	var gamepad = navigator.getGamepads()[ gamepadIndex ];

	if ( ! gamepad || ! guiData.inputOptions.joysEnabled ) {

		controller.buttons = 0xFF;
		controller.x = 0;
		controller.y = 0;
		return;

	}

	var buttons = gamepad.buttons;
	var numButtons = gamepad.buttons.length;

	// Joystick buttons

	var bit = 1;
	var buttonsByte = 0;
	for ( var i = 0, n = Math.min( numButtons, 8 ); i < n; i ++ ) {

		if ( buttons[ i ].pressed ) {

			buttonsByte |= bit;

		}

		bit <<= 1;

	}

	controller.buttons = 0xFF & ( ~ buttonsByte );

	// Joystick stick

	if ( gamepad.mapping === "standard" ) {

		// Left 4 button in cross

		if ( buttons[ 12 ].pressed ) controller.y = -1;
		else if ( buttons[ 13 ].pressed ) controller.y = 1;
		else controller.y = 0;

		if ( buttons[ 14 ].pressed ) controller.x = -1;
		else if ( buttons[ 15 ].pressed ) controller.x = 1;
		else controller.x = 0;

	}
	else {

		// Left analog stick

		controller.x = gamepad.axes[ 0 ];
		controller.y = gamepad.axes[ 1 ];

	}

}

function pollGamepads() {

	if ( joy1GamepadIndex != null ) {

		pollGamepad( joy1GamepadIndex, joy1Controller );

	}

	if ( joy2GamepadIndex != null ) {

		pollGamepad( joy2GamepadIndex, joy2Controller );

	}


}

function createPeripheralsMessage() {

	// Read gamepads

	pollGamepads();

	var threshold = 0.33;
	var joy1DirectionsByte = 0xFF;
	var joy2DirectionsByte = 0xFF;
	var joy1Buttons = 0xFF;
	var joy2Buttons = 0xFF;

	for ( var i = 0, n = controllersJoy1.length; i < n; i ++ ) {

		var controller = controllersJoy1[ i ];

		if ( controller.y < - threshold ) {

			joy1DirectionsByte &= 0x7F;

		}
		else if ( controller.y > threshold ) {

			joy1DirectionsByte &= 0xBF;

		}

		if ( controller.x < - threshold ) {

			joy1DirectionsByte &= 0xDF;

		}
		else if ( controller.x > threshold ) {

			joy1DirectionsByte &= 0xEF;

		}

		joy1Buttons &= controller.buttons;

	}

	for ( var i = 0, n = controllersJoy2.length; i < n; i ++ ) {

		var controller = controllersJoy2[ i ];

		if ( controller.y < - threshold ) {

			joy2DirectionsByte &= 0xF7;

		}
		else if ( controller.y > threshold ) {

			joy2DirectionsByte &= 0xFB;

		}

		if ( controller.x < - threshold ) {

			joy2DirectionsByte &= 0xFD;

		}
		else if ( controller.x > threshold ) {

			joy2DirectionsByte &= 0xFE;

		}

		joy2Buttons &= controller.buttons;

	}

	var message = {
		type: 'ensaimPeriph',
		joy1DirByte: joy1DirectionsByte,
		joy2DirByte: joy2DirectionsByte,
		joy1Buttons: joy1Buttons,
		joy2Buttons: joy2Buttons,
		keybBytes: keybWriteBuffer,
		mouseBytes: mouseWriteBuffer
	};

	keybWriteBuffer = null;
	currentKeybBytes = 0;

	mouseWriteBuffer = null;
	currentMouseBytes = 0;

	return message;

}

function initNetwork() {

	var location = document.location;

	socket = new WebSocket( "ws://" + location.host );
	socket.binaryType = 'arraybuffer';

	socket.onopen = function() {

		console.log( "Connection open." );

		peer = new SimplePeer( {
			trickle: false/*,
			config: { iceServers: [ { urls: 'stun:stun.l.google.com:19302' } ] }*/
		} );

		peer.on( 'signal', function ( signal ) {

			socket.send( JSON.stringify( signal ) );

		} );

		peer.on( 'stream', function ( stream ) {

			if ( 'srcObject' in audioElement ) {

				audioElement.srcObject = stream;

			}
			else {

				audioElement.src = URL.createObjectURL( stream );

			}

		} );

		/*
		peer.on('data', function (message) {

		} );
		*/

	};

	socket.onerror = function( data ) {

		alert( "Connection Error: " + data );

	};

	socket.onclose = function() {

		alert( "Connection Closed." );

	};

	socket.onmessage = function wsOnMessage( e ) {

		var data = e.data;

		if ( data instanceof ArrayBuffer ) {

			// Binary message

			switch ( binaryState ) {

				case BINARY_STATE_IDLE:
					// Nothing to do here
					break;

				case BINARY_STATE_WAITING_FRAME:

					if ( videoValid ) {

						// Image frame data received

						if ( frameSize !== data.byteLength ) {

							console.log( "Error: Incorrect frame size received. Expected " + frameSize + ", received " + data.byteLength );
							return;

						}

						// Convert native image to RGB24 in imageData
						nativeScreenToRGB24Function( new Uint8Array( data ), imageData, currentMode );

						// Show the frame in the view canvas

						if ( ! guiData.viewOptions.interlaced ) {

							canvasCtx.putImageData( imageData, 0, 0 );

						}
						else {

							if ( interlacedOdd ) {

								interlacedCanvasCtx1.putImageData( imageData, 0, 0 );

								canvasCtx.drawImage( interlacedCanvas0, 0, 0 );
								canvasCtx.globalAlpha = 0.5;
								canvasCtx.drawImage( interlacedCanvas1, 0, 0 );
								canvasCtx.globalAlpha = 1;

								interlacedOdd = false;

							}
							else {

								interlacedCanvasCtx0.putImageData( imageData, 0, 0 );

								interlacedOdd = true;

							}

						}

						socket.send( JSON.stringify( createPeripheralsMessage() ) );

						// Update FPS display
						if ( guiData.viewOptions.showInfo ) {

							stats.update();

						}

					}

					break;

				default:
					break;

			}

			binaryState = BINARY_STATE_IDLE;

		}
		else {

			// JSON text message

			var dataJSON = JSON.parse( data );

			if ( dataJSON ) {

				switch ( dataJSON.type ) {

					case 'ensaimModeChange':

						var newMode = dataJSON.newMode;
						newMode.interlacedCanvas0 = null;
						newMode.interlacedCanvasCtx0 = null;
						newMode.interlacedCanvas1 = null;
						newMode.interlacedCanvasCtx1 = null;

						var storedMode = getMode( newMode.modeWord, newMode.xResolution, newMode.yResolution );

						if ( ! storedMode ) {

							addMode( newMode );
							storedMode = newMode;

							storedMode.canvas = createCanvas( storedMode.xResolution, storedMode.yResolution );
							attachMouseEventEmitter( storedMode.canvas );
							storedMode.canvasCtx = storedMode.canvas.getContext( '2d' );
							storedMode.interlacedCanvas0 = createCanvas( storedMode.xResolution, storedMode.yResolution );
							storedMode.interlacedCanvasCtx0 = storedMode.interlacedCanvas0.getContext( '2d' );
							storedMode.interlacedCanvas1 = createCanvas( storedMode.xResolution, storedMode.yResolution );
							storedMode.interlacedCanvasCtx1 = storedMode.interlacedCanvas1.getContext( '2d' );

						}

						xResolution = storedMode.xResolution;
						yResolution = storedMode.yResolution;
						aspect = xResolution / yResolution;
						frameSize = 2 * storedMode.wordsPerPixel * storedMode.xResolution * storedMode.yResolution;

						var oldCanvas = canvas;
						canvas = storedMode.canvas;
						canvas.style.imageRendering = guiData.viewOptions.pixelated ? "pixelated" : "auto";
						canvasCtx = storedMode.canvasCtx;

						interlacedCanvas0 = storedMode.interlacedCanvas0;
						interlacedCanvasCtx0 = storedMode.interlacedCanvasCtx0;
						interlacedCanvas1 = storedMode.interlacedCanvas1;
						interlacedCanvasCtx1 = storedMode.interlacedCanvasCtx1;

						canvasCtx.fillStyle = "black";
						canvasCtx.fillRect( 0, 0, xResolution, yResolution );

						imageData = canvasCtx.getImageData( 0, 0, xResolution, yResolution );
						setPixelFunction( storedMode );

						container.replaceChild( canvas, oldCanvas );

						currentMode = storedMode;
						videoValid = true;

						console.log( "Video mode changed to " + storedMode.xResolution + "x" + storedMode.yResolution );

						onWindowResize();

						break;

					case 'ensaimFrame':

						binaryState = videoValid ? BINARY_STATE_WAITING_FRAME : BINARY_STATE_IDLE;

						break;

					case 'ensaimNovideo':

						canvasCtx.fillStyle = "blue";
						canvasCtx.fillRect( 0, 0, xResolution, yResolution );

						alert( "Video was disconnected." );

						videoValid = false;

						binaryState = BINARY_STATE_IDLE;

						break;

					case 'ensaimNumClients':

						numConnectedClients = dataJSON.numClients;
						updateInfo();

						break;

					default:

						// Assumed to be a WebRTC signaling message
						peer.signal( dataJSON );

						//console.log( "WebRTC message: " );
						//console.log( dataJSON );

						break;

				}

			}

		}

	};

}
