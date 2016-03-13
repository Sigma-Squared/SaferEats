/// <reference path="./typings/main.d.ts" />
'use strict';

const restaurant = require('./restaurant.js');
const fs = require('fs');
const csv_stream = require('csv-stream');

function load_data(callback) {
    let dat = [];
    let options = { columns: ['name','program_identifier','inspection_date','description','address','city','zip_code',
    'phone','longitude','latitude','inspection_business_name','inspection_type','inspection_score','inspection_result',
    'inspection_closed_business','violation_type','violation_description','violation_points','business_ID',
    'inspection_serial_num','violation_record_ID','location'], enclosedChar: '"'};

    let prev_rest = null;
    let mystream = csv_stream.createStream(options);
    console.log('Loading data into memory...');
    
    const fname = 'small_data.csv';
    const total_lines = { 'small_data.csv': 150, 'raw_data.csv': 245531 };
    let line_count = 0;
    let n_restaurants = 0;
    let n_violations = 0;
    
    let bounds = { min_long: 999, min_lat:999, max_long:0, max_lat:0 }
    function update_bounds(rest) {
        let x = rest.location[0], y = rest.location[1];
        if (x<bounds.min_long) bounds.min_long = x;
        if (x>bounds.max_long) bounds.max_long = x;
        if (y<bounds.min_lat) bounds.min_lat = y;
        if (y>bounds.max_lat) bounds.max_lat = y;
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
                let new_restaurant  = new restaurant(data.name, data.address, data.city, 
                                        [Number(data.longitude), Number(data.latitude)], data.phone || undefined, data.business_ID);
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
            console.log(`\nFinished. Loaded ${n_restaurants} restaurants and ${n_violations} violations.`)
            callback(dat, bounds);
        });
}
module.exports = load_data;