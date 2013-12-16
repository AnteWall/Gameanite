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
		console.log(GAME_ROWS);
		console.log(GAME_COLUMS);
		for(var y = 0; y <= GAME_ROWS; y++){
			var $tr = $('<tr>');

			for(var x = 0; x <= GAME_COLUMS; x++){
				var $td = $('<td>',{"id":"x"+x+"y"+y});
				$td.appendTo($tr);
			}
			$tr.appendTo($table);
		}

		this.GAME_DIV.prepend($table);

		$('.dark-bg').fadeOut(1000,function(){
			this.remove();
		})

	}
	Gameanite.prototype.ParseJSON = function(jsonFile) {

		var json = $.parseJSON(jsonFile.currentTarget.result);
		var g = json["Gameanite"];
		GAME_ROWS = g["Info"]["GAME_ROWS"];
		GAME_COLUMS = g["Info"]["GAME_COLUMS"];
		START_X = g["Info"]["START_X"];
		START_Y = g["Info"]["START_Y"];
		console.log(this);
		this.CreateGameField();

	};


});