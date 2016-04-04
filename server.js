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
    const errMsg = "Bad GET request.";
    let app = express();
    app.set('json spaces', 3);
    
    app.get('/binary', function(req, res) {
        let name = req.query.name;

        if (!name) {
            console.log("Name query not found.");
            res.send(errMsg+'<br\>'
            +'Proper form: <pre>/binary?name=&lt;NAME&gt;</pre>');
        } else {
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
    });
    
    app.get('/area', function (req, res) {
        let long = Number(req.query.long);
        let lat = Number(req.query.lat);
        let radius = Number(req.query.dist);
        
        if (!long || !lat || !radius) {
            console.log("Longitude, latitude or radius query not found or is NaN.");
            res.send(errMsg+'<br\>'
            + 'Proper form: <pre>/area?lat=&lt;LATTITUDE&gt;&amp;long=&lt;LONGITUDE&gt;&amp;dist=&lt;RADIUS&gt;</pre>');
        } else {
            let loc = {longitude: long, latitude: lat};
            console.log(`Searching for restaurants in block containing (${lat},${long}) within radius ${radius}m`);
            let rests = tree.find(loc);
            if (rests == null) {
                console.log("Coordinates not in range.");
                res.json(null);
            } else {
                let filtered = rests.filter( R => R.distance_to(loc)<radius );
                console.log(`Found ${filtered.length} restaurants within the radius`);
                res.json(filtered);
            }        
        }
    });

    app.get('/mults', function(req, res) {
        let substr = req.query.substr;
        
        if (!substr) {
            console.log("Substring query not found.");
            res.send(errMsg+'<br\>'
            +'Proper form: <pre>/mults?substr=&lt;SUBSTRING&gt;</pre>');
        } else {
            console.log(`Performing substring search for:"${substr}"`);
            let qur = substr.toUpperCase();
            let results = algorithms.subSearch(data, qur);
            if (results.length > 0){
                res.json(results);
            }
            else {
                res.json(null);
            }
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
    
    app.get('/favicon.ico', function(req, res) {
       res.status(200);
       res.sendFile(path.join(__dirname + '/favicon.ico')); 
    });

    app.listen(port, function() {
        console.log(`Server running on port ${port}. (^C to exit)`);
    });
}
load_data(main);

