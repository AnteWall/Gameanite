Gameanight
=========

Gameanight is a webbased customizable Gameboard.

  - Create your own Gameboard
  - Add Cards with custom functions!
  - Play with your friends using your Android Phone!

Gameanight creates a gameboard using your custom JSON file, creates a gameroom with your Game name and make it possible to connect to through the Gameanight Android App and Socket.IO.

Version
----

###0.2


Changelog
-----------
#####0.2:
  - "Functional" Game
  - Socket Works with Android App
  - Current Player List
#####0.1:
  - Started working on Gameanite Class



TODO
----------
  - Add Socket.IO
  - Complete Basic Game Class
  - Start on Android App

Tech
-----------

Gameanight uses a number of open source projects to work properly:

* [node.js] - evented I/O for the backend
* [Express] - fast node.js network app framework
* [Twitter Bootstrap] - great UI boilerplate for modern web apps]
* [jQuery] - Javascript Framework 


Requirements
--------------
* [node.js] - Version 0.10.*

Installation
--------------
Git clone this repository and move to directory

```sh
npm install
node app.js
```

Custom JSON Example
--------------
```sh
{    
	"Gameanite":{
		"Info":{
			"GAME_ROWS": 10,
			"GAME_COLUMS": 10,
			"START_X": 4,
			"START_Y": 4
		},
		"Cards":[
			{
				"Title": "Card Title",
				"Description": "Card Description",
				"POSX": 2, //Position x axis of Card on board
				"POSY": 2, //Position y axis of Card on board
				"NEXTX": 3, //Where to go next on x axis
				"NEXTY": 4, // Where to go next on y axis
				"FUNCTION": "function(){ alert('Alert the people!');}"  //Custom function to execute on CardShow()
			}
		]
	}
}
```

License
----

MIT

  [node.js]: http://nodejs.org
  [Twitter Bootstrap]: http://twitter.github.com/bootstrap/
  [jQuery]: http://jquery.com  
  [express]: http://expressjs.com
  
    
