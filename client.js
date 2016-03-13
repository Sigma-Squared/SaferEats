var app = angular.module('mainApp',[]);
//global url
//var gu = 'http://192.168.2.220';
var gu = 'http://almogo.noip.me';

//const Restaurant = require(gu + "/files/restaurant.js");

app.filter('firstUp', function(){
	return function(input){
		input = input || "";
		var outAr = input.split (' ');
		var out = "";
		console.log(outAr);
		for (let i = 0; i < outAr.length; i++){
			let r = outAr[i].charAt(0).toString().toUpperCase() + outAr[i].substr(1).toLowerCase();
			out = out + r + " ";
		}
		return out;
	}
});

app.controller('mainCtrl', function($scope, $http){
	$scope.haveCoords = false;
	$scope.haveSearchRes = false;
	$scope.searchParam = null;
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
		$scope.rests = [];
		var requests = [$scope.searchParam];
		$scope.haveSearchRes = false;
		for (let i = 0; i < requests.length; i++){
			var par = {
				method: 'GET',
				url: gu + '/mults?name=' + $scope.searchParam
			}
			$http(par).then(function success(response){
				console.log(response);	
				console.log(response.data);
				if (response.data != null){
					for (let j = 0; j < response.data.length; j++){
						$scope.rests.push(response.data[j]);
					}
					$scope.haveSearchRes = true;
				}
				else {
					//Note: This only works for requests arrays of length ONE
					alert("Could not find restaurant");
				}
				console.log($scope.rests);
			}, function failure(response){
				console.log("Failure: " + response);
			});
		}

		
	}
});

