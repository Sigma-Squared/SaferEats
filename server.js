// Ignore this, it's just for VS Code.
/// <reference path="typings/main.d.ts" />

'use strict';
const express = require('express');
const load_data = require('./data_loader.js');
const algorithms = require('./algorithms.js')

function main(data) {
    const port = 80;
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
    app.listen(port, function() {
        console.log(`Server running on port ${port}. (^C to exit)`);
    });
}

load_data(main);