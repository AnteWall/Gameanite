var socketio = require('socket.io');

var games = {};
var players = {};

module.exports.listen = function(app){
    var io = socketio.listen(app);
    io.sockets.on('connection',function(socket){

        //Emit Connected to server when client connects
        socket.emit('connected',{ status: "OK" });

        socket.on('client-connection',function(data){
            console.log("Client Connected!");
            console.log(data);

            socket.emit('gameList',games);
        });

        socket.on('rollDice',function(data){

            var server = games[data.clientRoomSocket];
            io.sockets.socket(server.socketId).emit('player-roll',{
                "roll":data.roll
            });
        })

        socket.on('clientAdd',function(data){
            socket.room = data.clientRoom;
            players[socket] = {
                "name":data.clientName,
                "color":data.clientColor,
            };

            var server = games[data.clientRoomSocket];

            io.sockets.socket(server.socketId).emit('create-player',{
                "userName":data.clientName,
                "userColor":data.clientColor
            });

        });

        socket.on('client-room',function(data){
            console.log("GOT CLIENT ROOM REQUEST:");
            console.log(data);
        })

        socket.on('create-room',function(data){
            console.log("Creating Room!");
            games[socket.id] = {
                roomName :data.roomName,
                socketId: socket.id
            };
            console.log(games);
            socket.join(data.roomName);
            socket.isRoomGame = data.roomName;
            io.sockets.emit('gameList',games);

        });

        socket.on('disconnect',function(){
            if(socket.isRoomGame != undefined){
                console.log("GameClient Disconnected: "+socket.isRoomGame);
                io.sockets["in"](socket.isRoomGame).emit('game-disconnect',{message:"GameClient Disconnected:", status:"Error"});
                delete games[socket.id];
                io.sockets.emit('gameList',games);
            }
        });

    });
    return io;
}
