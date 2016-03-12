// Ignore this, it's just for VS Code.
/// <reference path="typings/main/ambient/express/index.d.ts" />
/// <reference path="typings/main/ambient/node/index.d.ts" />

'use strict';
const express = require('express');

// ! require() is synchronous so this works.
console.log('Loading data into memory...');
const data = require('./data_loader.js');
console.log('Finished.');

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