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
    'inspection_serial_num','violation_record_ID','location'] };

    let prev_rest = null;
    let mystream = csv_stream.createStream(options);
    console.log('Starting load');
    fs.createReadStream('small_data.csv').pipe(mystream)
        .on('error', function(err) {
            throw err;
        })
        .on('data', function(data) {
            if (prev_rest && data.business_ID == prev_rest.id) {
                //add violation
                prev_rest.add_violation(data.inspection_date, data.inspection_type, data.violation_type, data.inspection_score,
                data.inspection_result, data.inspection_closed_business, data.violation_description, data.violation_points);
            }
            else {
                let new_restaurant  = new restaurant(data.name, data.address, data.city, 
                                        [Number(data.longitude), Number(data.latitude)], data.phone || undefined, data.business_ID);
                new_restaurant.add_violation(data.inspection_date, data.inspection_type, data.violation_type, data.inspection_score,
                data.inspection_result, data.inspection_closed_business, data.violation_description, data.violation_points);
                dat.push(new_restaurant);
                prev_rest = new_restaurant;
            }
        })
        .on('end', function() {
            console.log('Loading finished.')
            callback(dat);
        });
}
module.exports = load_data;