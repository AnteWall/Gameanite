/*
 *	Gameanite (0.1)
 * 	by Ante Wall (www.antewall.se) <antewall@gmail.com>
 *
 *	
 *	
 *	
 *
 *	Copyright (c) 2014 Ante Wall (www.antewall.se)
 *	Licensed under the MIT license:
 *	http://www.opensource.org/licenses/mit-license.php
 *
 *	NOTE: This script requires jQuery to work.  Download jQuery at www.jquery.com
 */

$(function() {

  	var socket = io.connect();

	var game = new Gameanite();
	$('.create-game-form').submit(function(e){
		e.preventDefault();

		ReadFile();
		var inputName = $('.gameName').val();
		socket.emit('create-room',{
			roomName: inputName
		})

	});

	$('.MOVE').on('click',function(){
		game.SetMovingDistance(1);
	});

	function ReadFile(){
		var file = $('.gameUpload').prop('files')[0];
		var reader = new FileReader();
		reader.onload = function(r){
			game.ParseJSON(r)
		}
		reader.readAsText(file);
	}

	/**
	*	Create Player 
	*
	*	@param {string} name - Name of Player
	*	@param {int} x - StartPosition x-axis
	*	@param {int} y - StartPosition y-axis
	*   @return {Player} - Returns Player Created
	*/
	function Player(name,x,y,color){
		this.name = name;
		this.posX = x;
		this.posY = y;
		this.color = color;
		this.moves;
		return this;
	}

	function Gameanite(){
		this.GAME_DIV = $('.gameanite-wrapper');		
		this.PLAYERS = [];
		this.START_X = 0;
		this.START_Y = 0;
		this.CELL_H = 40;
		this.CELL_W = 40;
		this.PLAYER_H = 20;
		this.PLAYER_W = 20;
		this.PLAYER_GROUPS = [];
		this.GAME_ROWS = 0;
		this.GAME_COLUMS = 0;
		this.CARDS = [];
		this.CURRENTPLAYER = 0;
	}
	function Card(pX,pY,Desc,Title,nX,nY,func){
		this.posX = pX;
		this.posY = pY;
		this.Description = Desc;
		this.Title = Title;
		this.nextX = nX;
		this.nextY = nY;
		this.function = func
	}
	Gameanite.prototype.CreateGameField = function(){

		var $table = $('<table>',{class:"game-field-table"});

		for(var y = 0; y < GAME_ROWS; y++){
			var $tr = $('<tr>');
			for(var x = 0; x < GAME_COLUMS; x++){
				var $td = $('<td>',{"id":"x"+x+"y"+y});
				$td.appendTo($tr);
			}
			$tr.appendTo($table);
		}
		console.log(this.CARDS);
		this.GAME_DIV.prepend($table);

		//this.PLAYERS.push(new Player("Ante",this.START_X,this.START_Y));

		//this.DrawPlayers();

		$('.dark-bg').fadeOut(1000,function(){
			this.remove();
			
		})
	}

	Gameanite.prototype.AddPlayer = function(name,color){
		this.PLAYERS.push(new Player(name,this.START_X,this.START_Y,color));
		this.DrawPlayers();
	}

	Gameanite.prototype.ParseCards = function(json){
		var pThis = this;
		$.each(json,function(){			
			var c = new Card(this.POSX,this.POSY,this.Description,this.Title,this.NEXTX,this.NEXTY,this.FUNCTION);
			pThis.CARDS[(this.POSY)][this.POSX] = c;
		})
	}

	Gameanite.prototype.ShowCard = function(x,y){
		var card = this.CARDS[y][x];

		$darkBG = $('<div>',{class:"dark-bg"});
		$card = $('<div>',{class:"card"});

		$title = $('<p>',{class:"title"}).text(card.Title);
		$desc = $('<p>',{class:"desc"}).text(card.Description);

		$closeBtn = $('<button>',{class:"btn btn-danger btn-block close-btn-card"}).text("Close");

		$closeBtn.on('click',function(){
			$('.card').fadeOut(300,function(){
				$('.dark-bg').remove();
			})
		});

		$title.appendTo($card);
		$desc.appendTo($card);
		$closeBtn.appendTo($card);

		$card.appendTo($darkBG);
		$darkBG.appendTo(this.GAME_DIV);
		console.log(card.function);
		if(card.function != undefined){
			var f = eval("(" + card.function + ")");
			f();
		}
	}

	/**
	*	Set Game Variables from JSON file
	*	
	*	@param {File} jsonFile - File with JSON data in it
	*/
	Gameanite.prototype.ParseJSON = function(jsonFile) {

		var json = $.parseJSON(jsonFile.currentTarget.result);
		var g = json["Gameanite"];
		GAME_ROWS = g["Info"]["GAME_ROWS"];
		GAME_COLUMS = g["Info"]["GAME_COLUMS"];
		this.START_X = g["Info"]["START_X"];
		this.START_Y = g["Info"]["START_Y"];
		this.CreateCardHolder();
		this.ParseCards(g["Cards"]);
		this.CreateGameField();

	};
	Gameanite.prototype.CreateCardHolder = function(){
		for(var y = 0; y < GAME_ROWS; y++){
			this.CARDS[y] = [];
			for(var x = 0; x < GAME_COLUMS; x++){
				this.CARDS[y][x] = null;
			}
		}
	}
	/**
	*	Calculate position of player
	*	
	*	@param {Player} player - PlayerClass
	*	@returns {json} - JSON with height and width
	*/
	Gameanite.prototype.CalculatePosition = function(x,y){
		var width = ( x * this.CELL_W ) + (this.CELL_W/2) - (this.PLAYER_W / 2);
		var height = ( y * this.CELL_H ) + (this.CELL_H/2) - (this.PLAYER_H / 2);

		return { "height": height, "width": width };
	}

	/**
	*	Draw Player from startposition
	*/
	Gameanite.prototype.DrawPlayers = function(){
		$('.player').remove();
		for(var i = 0; i < this.PLAYERS.length; i++){
			var positions = this.CalculatePosition(this.PLAYERS[i].posX,this.PLAYERS[i].posY);

			var $pDiv = $('<div>',{"class":"player","data-playername":this.PLAYERS[i].name});

			$pDiv.css("top",positions.height + "px");
			$pDiv.css("left",positions.width + "px");
			$pDiv.css('background',this.PLAYERS[i].color);
			$pDiv.appendTo(this.GAME_DIV).hide().fadeIn();
		}
	}

	Gameanite.prototype.AnimateWalk = function(player,newX,newY){
			var Tself = this;
			player.posX = newX;
			player.posY = newY;
			var pos = this.CalculatePosition(player.posX,player.posY);
			this.GAME_DIV.find("[data-playername='" + player.name + "']").animate({"top":pos.height+"pX","left":pos.width+"px"},1000,function(){
				player.moves -=1;
				if(player.moves == 0){
					Tself.ShowCard(newX,newY);
				}else{
					Tself.MovePlayer();
				}
			});
	}

	Gameanite.prototype.MovePlayer = function(){

		var pPosX = this.PLAYERS[this.CURRENTPLAYER].posX;
		var pPosY = this.PLAYERS[this.CURRENTPLAYER].posY;
		console.log("CARD [" + pPosY + "][" + pPosX + "]");
		var nextX = this.CARDS[pPosY][pPosX].nextX;
		var nextY = this.CARDS[pPosY][pPosX].nextY;
		this.AnimateWalk(this.PLAYERS[this.CURRENTPLAYER],nextX,nextY);

	}

	Gameanite.prototype.SetMovingDistance = function(m){
		this.PLAYERS[this.CURRENTPLAYER].moves = m;
		this.MovePlayer();
	}


	socket.on('connected', function (data) {
    	console.log(data);
    	
    	socket.on('create-player',function(data){
    		console.log(data);
    		game.AddPlayer(data.userName,data.userColor);
    	});

    	socket.on('player-roll',function(data){
    		game.SetMovingDistance(data.roll);
    	});

  	});



});