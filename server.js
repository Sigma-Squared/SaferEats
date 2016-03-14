// Ignore this, it's just for VS Code.
/// <reference path="typings/main.d.ts" />

'use strict';
const express = require('express');
const load_data = require('./data_loader.js');
const algorithms = require('./algorithms.js');
const quadtree = require('./simplequadtree.js');

function main(data, tree) {
    const port = 80;
    let app = express();
    app.set('json spaces', 3);
    app.get('/api', function(req, res) {
        let name = req.query.name
        let long = req.query.long;
        let lat = req.query.lat;
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
        else if (long && lat) {
            let loc = {longitude: Number(long), latitude: Number(lat)};
            console.log(`Searching for restaurants in block containing (${lat},${long})`);
            let rests = tree.find(loc);
            console.log(`Found ${rests.length} restaurants in the block.`);
            res.json(rests)
        }
        else {
            res.send('Bad GET request.')
        }
        
    });
    app.listen(port, function() {
        console.log(`Server running on port ${port}. (^C to exit)`);
    });
}
load_data(main);