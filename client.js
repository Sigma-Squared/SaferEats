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
        this.violations.push({
            date, insp_type, viol_type, score, result, closed, desc, points
        });
    }
}

var app = angular.module('mainApp',[]);
//global url
//var gu = 'http://192.168.2.220';
var gu = 'http://almogo.noip.me';

//const Restaurant = require(gu + "/files/restaurant.js");

app.controller('mainCtrl', function($scope, $http){
	$scope.haveCoords = false;
	$scope.haveSearchRes = false;
	$scope.searchParam = "fef";
	$scope.personalData = [];
	$scope.rests = [];

	
	$scope.showrests = function(){
		console.log($scope.rests);
		console.log($scope.personalData);
	}

	$scope.getLoc = function(){
	if (navigator.geolocation) {
	    navigator.geolocation.getCurrentPosition(function(position){
	      $scope.$apply(function(){
	        $scope.position = position;
		console.log(position);
		$scope.haveCoords = true;
	      });
	    });
  	}
	}
	$scope.search = function(){
		if (true){
			var par = {
				method: 'GET',
				url: gu + '/api?name=' + $scope.searchParam
			}
			$http(par).then(function success(response){
				console.log(response);
				$scope.rests = [response.data];
				verifyRes([response.data]);
			}, function failure(response){
				console.log("Failure: " + response);
			});
		}
	}

	var verifyRes = function(r){
		if (r.length == 0){
			$scope.haveSearchRes = false;
		}
		else {
			$scope.haveSearchRes = true;
			for (let i = 0; i < r.length; i++){
				if (r[i] == null){
					$scope.haveSearchRes = false;
				}
			}
		}
	}
});

