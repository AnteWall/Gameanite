
/**
 * Module dependencies.
 */
var express        = require('express');
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var app            = express();
var routes         = require('./routes');
var http           = require('http');
var sass           = require('node-sass');


app.set('view engine', 'jade');
app.use(morgan('dev')); 					// log every request to the console
app.use(bodyParser()); 						// pull information from html in POST
app.use(methodOverride()); 					// simulate DELETE and PUT
app.use(sass.middleware({
    src: __dirname + '/sass',
    dest: __dirname + '/public',
    debug: true
}));
app.use(express.static(__dirname + '/public')); 	// set the static files location /public/img will be /img for users

console.log('Server Started!'); 			// shoutout to the user

app.get('/', routes.index);

var io = require('./routes/socket.js').listen(http.createServer(app).listen(5000), function(){
  //console.log('Express server listening on port ' + app.get('port'));
});


io.set('log level', 1);
io.configure(function () { 
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 1); 
});
