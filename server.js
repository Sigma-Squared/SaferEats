'use strict';
const express = require('express');
const Restaurant = require('./restaurant.js');

const port = 8080;
let app = express();

//example server
app.get('/api', function(req, res) {
	let rest1 = new Restaurant('name1', 'addr1', [0,0]);
	let rest2 = new Restaurant('name2', 'addr2', [2,2]);
	let restArray = [rest1, rest2];
	res.json(restArray);
});
app.listen(port, function() {
	console.log(`Server running. Go to http://localhost:${port}/api`);
});