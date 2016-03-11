'use strict';
const Restaurant = require('./restaurant.js');

//example client
function main() {
	let myRestaurant = new Restaurant("Popeyes", "some_address", [-42.3213123,25.41232144]);
	console.log(myRestaurant);
}

main();