'use strict';
function deg2rad(deg) {
    return deg * Math.PI/180; 
}
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
    distance_to(location) {
        const R = 6371000; // metres
        let lat1 = deg2rad(location.latitude), lon1 = deg2rad(location.longitude);
        let lat2 = deg2rad(this.location.latitude), lon2 = deg2rad(this.location.longitude);
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat/2),2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon/2),2); 
        let c = 2 * Math.atan2( Math.sqrt(a), Math.sqrt(1-a) );
        return R * c;
    }
}
module.exports = Restaurant;