// Ignore this, it's just for VS Code.
/// <reference path="typings/main.d.ts" />

'use strict';
const express = require('express');
const load_data = require('./data_loader.js');

function main(data) {
    const port = 80;
    let app = express();

    //example server
    app.get('/api', function(req, res) {
        let rest_array = [];
        let query = req.query.name
        console.log(`Doing linear search for restaurants with name ${query}`);
        //simple linear search
        for (let restaurant of data) {
            if (restaurant.name == query)
            rest_array.push(restaurant);  
        }    
        res.json(rest_array);
    });
    app.listen(port, function() {
        console.log(`Server running on port ${port}`);
    });
}

load_data(main);