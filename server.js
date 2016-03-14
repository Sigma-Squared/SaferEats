// Ignore this, it's just for VS Code.
/// <reference path="typings/main.d.ts" />

'use strict';
const express = require('express');
const load_data = require('./data_loader.js');
const algorithms = require('./algorithms.js');
const quadtree = require('./simplequadtree.js');
const path = require('path');

function main(data, tree) {
    const port = 8080;
    let app = express();
    app.set('json spaces', 3);
    app.get('/api', function(req, res) {
        let name = req.query.name
        let long = req.query.long;
        let lat = req.query.lat;
        let substr = req.query.substr;
        if (name) {
            name = name.toUpperCase();
            console.log(`Doing binary search for name:"${name}"`);
            let index =  algorithms.binaryIndexOf(name, data);
            if (index != -1) {
                res.json( data[index] );
                console.log("Found.")
            }
            else {
                res.json(null);
                console.log("Not found.");
            }
        }
        else if (substr) {
            substr = substr.toUpperCase()
            console.log(`Performing substring search for:"${substr}"`);
            let results = algorithms.subSearch(data, substr);
            console.log(`${results.length} results found.`)
            if (results.length > 0){
                res.json(results);
            }
            else {
                res.json(null);
            }
        }
        else if (long && lat) {
            let loc = {longitude: Number(long), latitude: Number(lat)};
            console.log(`Searching for restaurants in block containing (${lat},${long})`);
            let rests = tree.find(loc);
            if (rests != null)
                console.log(`Found ${rests.length} restaurants in the block.`);
            else
                console.log('Coordinates not in range.');

            res.json(rests);        
        }
        else {
            res.send('Bad GET request.')
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
        res.sendFile(path.join(__dirname + '/index.html'));
	});

	app.get('/client.js', function (req, res) {
        res.status(200);
        res.sendFile(path.join(__dirname + '/client.js'));
	});

    app.listen(port, function() {
        console.log(`Server running on port ${port}. (^C to exit)`);
    });
}
load_data(main);

