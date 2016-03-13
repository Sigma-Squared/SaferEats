'use strict'
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use('/files/', express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fs = require('fs');
const Restaurant = require('./restaurant.js');
var dataLoader = require('./data_loader.js');

var data = dataLoader.load_data();

app.get('/search', function(req, res) {

	res.status(200);
	let rest_array = [];
	let query = req.query.name;
	for (let rest of data){
		if (rest.name == query){
			rest_array.push(rest);
		}
	}
	res.json(rest_array);
});

app.get('/', function (req, res) {
	  //res.send('Hello World, I work great!');
	res.status(200);
	res.sendFile("/home/ori/site/index.html");
	//  fs.appendFile("log", "HelloThere\n", function(){});
});

app.get('/client.js', function (req, res) {
	res.status(200);
	res.sendFile("/home/ori/site/client.js");
});

app.listen(8080, function () {
	console.log('2XB3 server running onport 8080!');
});
