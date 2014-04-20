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

	$('.NP').on('click',function(){
    	game.AddPlayer("Test"+Math.random(),"blue");
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
		this.GAME_COLUMNS = 0;
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

	Gameanite.prototype.DrawGameField = function(){
		for(var y = 0; y < GAME_ROWS; y++){
			for(var x = 0; x < GAME_COLUMNS; x++){
				if(this.CARDS[y][x] != null){
					this.GAME_DIV.find("#x"+x+"y"+y).css("background","green");
				}
			}
		}

	}

	Gameanite.prototype.NextPlayer = function(){
		this.CURRENTPLAYER += 1;
		if(this.CURRENTPLAYER > this.PLAYERS.length - 1){
			this.CURRENTPLAYER = 0;
		}
		this.SetCurrentPlayerInList();
	}

	Gameanite.prototype.SetCurrentPlayerInList = function(){

		$('ul.player-list li').removeClass('current-player');

		$('.player-list').find("[data-player='" + this.PLAYERS[this.CURRENTPLAYER].name + "']").addClass('current-player');

	}

	Gameanite.prototype.CreateGameField = function(){

		var $table = $('<table>',{class:"game-field-table"});
		for(var y = 0; y < GAME_ROWS; y++){
			var $tr = $('<tr>');
			for(var x = 0; x < GAME_COLUMNS; x++){
				var $td = $('<td>',{"id":"x"+x+"y"+y});
				$td.appendTo($tr);
			}
			$tr.appendTo($table);
		}
		this.GAME_DIV.prepend($table);

		this.DrawGameField();
		//this.PLAYERS.push(new Player("Ante",this.START_X,this.START_Y));

		//this.DrawPlayers();

		$('.dark-bg').fadeOut(1000,function(){
			this.remove();
			
		})
	}

	Gameanite.prototype.AddPlayer = function(name,color){
		this.PLAYERS.push(new Player(name,this.START_X,this.START_Y,color));
		this.AddPlayerToPlayerScreen(name,color);
		this.DrawPlayers();
		this.SetCurrentPlayerInList();
	}

	Gameanite.prototype.ParseCards = function(json){
		var pThis = this;
		$.each(json,function(){			
			var c = new Card(this.PosX,this.PosY,this.Description,this.Title,this.NextX,this.NextY,this.function);
			pThis.CARDS[(this.PosY)][this.PosX] = c;
		})
	}

	Gameanite.prototype.AddPlayerToPlayerScreen = function(name,color){
		$color = $('<div>',{class:"player-color"}).css("background-color",color);
		$pname = $('<p>',{class:"name"}).text(name);
		$li = $('<li>',{"data-player":name});

		$color.appendTo($li);
		$pname.appendTo($li);
		$li.appendTo($('.player-list'));
	}

	Gameanite.prototype.ShowCard = function(x,y){
		var Tself = this;

		var card = this.CARDS[y][x];
		var $bg = $('<div>',{"class":"dark-bg"});

		var $card = $('<div>',{"class":"card"});

		var $cardinfo = $('<div>',{'class':'card-info'});

		var $cardSubject = $('<p>',{'class':'subject'}).text(card.Title);
		$cardSubject.appendTo($cardinfo);

		var $cardDesc = $('<p>',{'class':'desc'}).text(card.Description);
		$cardDesc.appendTo($cardinfo);

		$cardinfo.appendTo($card);

		var $button = $('<button>',{'text':"Close",class:"btn btn-danger"});
		
		/*var card = this.CARDS[y][x];

		$darkBG = $('<div>',{class:"dark-bg"});
		$card = $('<div>',{class:"card"});

		$title = $('<p>',{class:"title"}).text(card.Title);
		$desc = $('<p>',{class:"desc"}).text(card.Description);

		$closeBtn = $('<button>',{class:"btn btn-danger btn-block close-btn-card"}).text("Close");

		*/
		$button.on('click',function(){
			$('.card').fadeOut(300,function(){
				$('.dark-bg').remove();
				Tself.NextPlayer();
			})
		});
		$button.appendTo($card);
		$card.appendTo($bg);
		$bg.appendTo(this.GAME_DIV);
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
		GAME_COLUMNS = g["Info"]["GAME_COLUMNS"];
		this.START_X = g["Info"]["START_X"];
		this.START_Y = g["Info"]["START_Y"];
		this.CreateCardHolder();
		this.ParseCards(g["Cards"]);
		this.CreateGameField();

	};
	Gameanite.prototype.CreateCardHolder = function(){
		for(var y = 0; y < GAME_ROWS; y++){
			this.CARDS[y] = [];
			for(var x = 0; x < GAME_COLUMNS; x++){
				this.CARDS[y][x] = null;
			}
		}
	}
	/**
	*	Calculate position of player
	*	
	*	@param {Player} player - PlayerClass
	*	@returns {{height: number, width: number}} - JSON with height and width
	*/
	Gameanite.prototype.CalculatePosition = function(x,y){
        var borderH = 2*y;
        var borderW = 2*x;
		var width = ( x * this.CELL_W ) + (this.CELL_W/2) - (this.PLAYER_W / 2) + borderW;
		var height = ( y * this.CELL_H ) + (this.CELL_H/2) - (this.PLAYER_H / 2) + borderH;

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
    	
    	socket.on('create-player',function(data){
    		game.AddPlayer(data.userName,data.userColor);
    	});

    	socket.on('player-roll',function(data){
    		game.SetMovingDistance(data.roll);
    	});

  	});



});