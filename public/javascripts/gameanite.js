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

	var game = new Gameanite();
	$('.create-game-form').submit(function(e){
		e.preventDefault();

		ReadFile();
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
	function Player(name,x,y){
		this.name = name;
		this.posX = x;
		this.posY = y;
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

		this.PLAYERS.push(new Player("Ante",this.START_X,this.START_Y));
		this.PLAYERS.push(new Player("Anton",this.START_X,this.START_Y));

		this.DrawPlayers();

		$('.dark-bg').fadeOut(1000,function(){
			this.remove();
			
		})
	}

	Gameanite.prototype.ParseCards = function(json){
		var pThis = this;
		$.each(json,function(){			
			var c = new Card(this.POSX,this.POSY,this.Description,this.Title,this.NEXTX,this.NEXTY,this.FUNCTION);
			pThis.CARDS[(this.POSY)][this.POSX] = c;
		})
		console.log(this.CARDS);
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
		for(var i = 0; i < this.PLAYERS.length; i++){
			var positions = this.CalculatePosition(this.PLAYERS[i].posX,this.PLAYERS[i].posY);

			var $pDiv = $('<div>',{"class":"player","data-playername":this.PLAYERS[i].name});

			$pDiv.css("top",positions.height + "px");
			$pDiv.css("left",positions.width + "px");

			$pDiv.appendTo(this.GAME_DIV);
		}

		this.AnimateWalk(this.PLAYERS[0],8,8);
	}

	Gameanite.prototype.AnimateWalk = function(player,newX,newY){

			player.posX = newX;
			player.posY = newY;
			var pos = this.CalculatePosition(player.posX,player.posY);
			this.GAME_DIV.find("[data-playername='" + player.name + "']").animate({"top":pos.height+"pX","left":pos.width+"px"},function(){
				
			});
	}

});