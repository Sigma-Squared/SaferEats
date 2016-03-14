/// <reference path="./typings/main.d.ts" />
'use strict';

const restaurant = require('./restaurant.js');
const fs = require('fs');
const csv_stream = require('csv-stream');
const quadtree = require('./simplequadtree.js');
//var plotly = require('plotly')('SigmaSquared','1w3xy8x7ca');

function load_data(callback) {
    let dat = [];
    let options = { columns: ['name','program_identifier','inspection_date','description','address','city','zip_code',
    'phone','longitude','latitude','inspection_business_name','inspection_type','inspection_score','inspection_result',
    'inspection_closed_business','violation_type','violation_description','violation_points','business_ID',
    'inspection_serial_num','violation_record_ID','location'], enclosedChar: '"'};

    let prev_rest = null;
    let mystream = csv_stream.createStream(options);
    console.log('Loading data into memory...');
    
    const fname = 'raw_data.csv';
    const total_lines = { 'small_data.csv': 150, 'raw_data.csv': 245531 };
    let line_count = 0;
    let n_restaurants = 0;
    let n_violations = 0;
    let bad_restaurants = 0;
    
    let bounds = { min_long: Infinity, min_lat:Infinity, max_long:-Infinity, max_lat:-Infinity }
    function update_bounds(rest) {
        let long = rest.location.longitude, lat = rest.location.latitude;
        if ( !long || !lat ) return;
        if (long<bounds.min_long) bounds.min_long = long;
        if (long>bounds.max_long) bounds.max_long = long;
        if (lat<bounds.min_lat) bounds.min_lat = lat;
        if (lat>bounds.max_lat) bounds.max_lat = lat;
    }
    fs.createReadStream(fname).pipe(mystream)
        .on('error', function(err) {
            throw err;
        })
        .on('data', function(data) {
            n_violations++;
            if (prev_rest && data.name == prev_rest.name) {
                //add violation
                prev_rest.add_violation(data.inspection_date, data.inspection_type, data.violation_type, data.inspection_score,
                data.inspection_result, data.inspection_closed_business, data.violation_description, data.violation_points);
            }
            else {
                //add restaurant and violation
                n_restaurants++;
                let latitude = Number(data.latitude), longitude = Number(data.longitude);
                
                let new_restaurant  = new restaurant(data.name, data.address, data.city, 
                                        {latitude, longitude}, data.phone || undefined, data.business_ID);
                update_bounds(new_restaurant);                   
                new_restaurant.add_violation(data.inspection_date, data.inspection_type, data.violation_type, data.inspection_score,
                data.inspection_result, data.inspection_closed_business, data.violation_description, data.violation_points);
                dat.push(new_restaurant);
                prev_rest = new_restaurant;
            }
            //comment out below line to remove progress indicator.
            process.stdout.write(`\r${(((++line_count)/total_lines[fname])*100).toFixed(2)}%`)
        })
        .on('end', function() {
            console.log(`\nFinished. Loaded ${n_restaurants} restaurants and ${n_violations} violations.`);
            let loc_rests = 0;
            //let tree = new quadtree(bounds.min_long, bounds.min_lat, bounds.max_long, bounds.max_lat, 1, 7, true);
            //console.log(bounds);
            let tree = new quadtree(-122.6, 47.1, -121.7, 47.85, 1, 5, true);
            console.log('Adding restaurants to quadtree...');
            //let points = {x:[], y:[], type:'scatter', mode:'markers'};
            for (let rest of dat) {
                if (rest.location.latitude && rest.location.longitude) {
                    //loc_rests++;
                    //points.x.push(rest.location.longitude);
                    //points.y.push(rest.location.latitude);
                    loc_rests += tree.insert(rest);
                }
            }
            //let graphOptions = {filename: 'Seattle Restaurants', fileopt:'overwrite'}
            //plotly.plot(points, graphOptions, function(err, msg) {
            //    if (err) throw err;
            //    console.log(msg);
            //});
            console.log(`Finished. Added ${loc_rests} restaurants to the qaudtree.`);
            //console.log(tree);
            callback(dat, tree);
        });
}

module.exports = load_data;