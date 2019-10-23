
if ( typeof module !== undefined ) {

	module.exports = {
		startServer: startServer,
		sendToClientsJSON: sendToClientsJSON,
		sendToClientsJSONBinary: sendToClientsJSONBinary,
		removeClient: removeClient,
		getClientParameters: getClientParameters,
		getURLParameters: getURLParameters,
		getNumClients: getNumClients
	};

}

var express = require( 'express' );
var WebSocket = require( 'ws' );
var http = require( 'http' );
var pathJoin = require( 'path' ).join;

var app, httpServer, wss;

var maxNumberOfClients = 10;

var nextClientId = 0;

var clients = [ ];

var onClientMessageInternal = null;
var onClientConnectedInternal = null;
var onClientDisconnectedInternal = null;

function startServer( listenPort, onStarted, onClientConnected1, onClientDisconnected1, onClientMessage1 ) {

	// Create server
	app = express();
	httpServer = http.Server( app );

	wss = new WebSocket.Server( { server: httpServer } );

	// Configure server

	// Serve all public content
	app.use( "/", express.static( pathJoin( __dirname, "../client" ) ) );

	// Setup connection with socket.io clients
	wss.on( 'connection', onClientConnection );

	onClientConnectedInternal = onClientConnected1;
	onClientDisconnectedInternal = onClientDisconnected1;
	onClientMessageInternal = onClientMessage1;

	// Start listening
	httpServer.listen( listenPort, onStarted );

}

function sendToClientsJSON( messageJSON ) {

	for ( var i = 0, il = clients.length; i < il; i ++ ) {

		clients[ i ].socket.send( messageJSON, function nop() {} );

	}

}

function sendToClientsJSONBinary( messageJSON, messageBinary ) {

	for ( var i = 0, il = clients.length; i < il; i ++ ) {

		var socket = clients[ i ].socket;

		socket.send( messageJSON, function nop() {} );
		socket.send( messageBinary, function nop() {} );

	}

}

function removeClient( client, reasonString ) {

	client.socket.close( 0, reasonString );

}

function getClientParameters( req ) {

	return getURLParameters( req.headers.referer );

}

function getURLParameters( url ) {

	var params = [];

	url = decodeURI( url );

	var index = url.indexOf( "?" );
	if ( index >= 0 ) {
		var paramString = url.substring( index + 1 );
		var paramStringArray = paramString.split( "&" );
		for ( var i = 0; i < paramStringArray.length; i ++ ) {
			var p = paramStringArray[ i ];
			var index2 = p.indexOf( "=" );
			if ( index2 >= 0 ) {
				params.push( {
					name: p.substring( 0, index2 ),
					value: p.substring( index2 + 1 )
				} );
			}
		}

	}

	return params;

}

// Main client connection function
function onClientConnection( socket, req ) {

	var client = {
		socket: socket,
		id: nextClientId ++
	};

	if ( clients.length > maxNumberOfClients ) {

		console.log( "Client rejected." );
		removeClient( client, "Too many clients, sorry." );
		return;

	}

	clients.push( client );

	console.log( "Client connected. (total: " + clients.length + ")" );

	//socket.heartbeatTimeout = this.config.connectionTimeout;

	socket.on( "close", function( msg ) {

		var index = clients.indexOf( client );
		if ( index >= 0 ) {

			clients.splice( index, 1 );

		}

		onClientDisconnectedInternal( client );

		console.log( "Client disconnected. (total: " + clients.length + ")" );

	} );

	socket.on( "message", function ( message ) {

		onClientMessageInternal( client, message );

	} );

	onClientConnectedInternal( client );

}

function getNumClients() {

	return clients.length;

}
