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

	var game = null;
	$('.create-game-form').submit(function(e){
		e.preventDefault();

		ReadFile();
	});

	function ReadFile(){
		game = new Gameanite();
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
	}
	Gameanite.prototype.CreateGameField = function(){

		var $table = $('<table>',{class:"game-field-table"});

		for(var y = 0; y <= GAME_ROWS; y++){
			var $tr = $('<tr>');

			for(var x = 0; x <= GAME_COLUMS; x++){
				var $td = $('<td>',{"id":"x"+x+"y"+y});
				$td.appendTo($tr);
			}
			$tr.appendTo($table);
		}

		this.GAME_DIV.prepend($table);

		this.PLAYERS.push(new Player("Ante",this.START_X,this.START_Y));
		this.DrawPlayers();

		$('.dark-bg').fadeOut(1000,function(){
			this.remove();
			
		})

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
		START_X = g["Info"]["START_X"];
		START_Y = g["Info"]["START_Y"];
		this.CreateGameField();

	};



	/**
	*	Calculate position of player
	*	
	*	@param {Player} player - PlayerClass
	*	@returns {json} - JSON with height and width
	*/
	Gameanite.prototype.calculatePlayerPos = function(player){
		console.log(player);
		var width = ( player.posX * this.CELL_W ) + (this.PLAYER_W / 2);
		var height = ( player.posY * this.CELL_H ) + (this.PLAYER_H / 2);

		return { "height": height, "width": width };
	}

	/**
	*	Draw Player from startposition
	*/
	Gameanite.prototype.DrawPlayers = function(){
		for(var i = 0; i <= this.PLAYERS.length; i++){
			var positions = this.calculatePlayerPos(this.PLAYERS[i]);

			var $pDiv = $('<div>',{"class":"player","data-playerName":this.PLAYERS[i].name});

			$pDiv.css("top",positions.height + "px");
			$pDiv.css("left",positions.width + "px");

			$pDiv.appendTo(this.GAME_DIV);
		}
	}



});