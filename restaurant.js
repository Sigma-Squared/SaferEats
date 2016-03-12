'use strict';
class Restaurant {
	constructor(name, address, location) {
		this.name = name;
		this.address = address;
		this.location = location;
    }

    getLocation() {
        return this.location;
    }

	getName() {
		return this.name;
	}

	getAddress() {
		return this.address;
	}
}

module.exports = Restaurant;