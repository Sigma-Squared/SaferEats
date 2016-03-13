'use strict';
class Restaurant {
	constructor(name, address, city, location, phone, id) {
		this.name = name;
		this.address = address;
        this.city = city;
		this.location = location;
        this.phone = phone;
        this.id = id;
        this.violations = [];
    }
    
    add_violation(date, insp_type, viol_type, score, result, closed, desc, points) {
        if (Number(score) == 0) return;
        this.violations.push({
            date, insp_type, viol_type, score, result, closed, desc, points
        })
    }
}

module.exports = Restaurant;