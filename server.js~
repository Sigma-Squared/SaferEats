// Ignore this, it's just for VS Code.
/// <reference path="typings/main.d.ts" />

'use strict';
const express = require('express');
const load_data = require('./data_loader.js');
const algorithms = require('./algorithms.js')

function main(data) {
    const port = 8080;
    let app = express();
    app.set('json spaces', 3);
    //example server
    app.get('/api', function(req, res) {
        let query = req.query.name.toUpperCase();
        console.log(`Doing binary search for name:"${query}"`);
        let index =  algorithms.binaryIndexOf(query, data);
        if (index != -1) {
            res.json( data[index] );
            console.log("Found.")
        }
        else {
            res.json(null);
            console.log("Not found.");
        }
    });

    	app.get('/mults', function(req, res) {
		console.log("Performing substring search for name: " + req.query.name);
		var qur = req.query.name.toUpperCase();
		var results = algorithms.subSearch(data, qur);
		if (results.length > 0){
			res.json(results);
		}
		else {
			res.json(null);
		}
	});

	app.get('/', function (req, res) {
	res.status(200);
	res.sendFile("/home/ori/new/index.html");
	});

	app.get('/client.js', function (req, res) {
	res.status(200);
	res.sendFile("/home/ori/new/client.js");
	});

    app.listen(port, function() {
        console.log(`Server running on port ${port}. (^C to exit)`);
    });
}

load_data(main);
