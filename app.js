
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var io = require('socket.io').listen(http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
}));

var games = {};
var players = [];

io.set('log level', 3);


io.sockets.on('connection',function(socket){

	//Emit Connected to server when client connects
	socket.emit('connected',{ status: "OK" });

	socket.on('client-connection',function(data){
		console.log("Client Connected!");
		console.log(data);

		socket.emit('gameList',games);
	});

	socket.on('create-user',function(data){
		socket.room = data.roomName;
		players.push(data.playerInfo);




	});


	socket.on('create-room',function(data){
		console.log("Creating Room!");
		games[socket.id] = {
			roomName :data.roomName						
		};
		console.log(games);
		socket.join(data.roomName);
		socket.isRoomGame = data.roomName;
		socket.emit('created-room',{status:"OK"});

	});

	socket.on('disconnect',function(){
		if(socket.isRoomGame != undefined){
			console.log("GameClient Disconnected: "+socket.isRoomGame);
			io.sockets["in"](socket.isRoomGame).emit('game-disconnect',{message:"GameClient Disconnected:", status:"Error"});
			delete games[socket.id];
		}
	});

});