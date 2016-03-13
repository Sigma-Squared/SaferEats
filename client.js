var app = angular.module('mainApp',[]);
//global url
//var gu = 'http://192.168.2.220';
var gu = 'http://almogo.noip.me';

//const Restaurant = require(gu + "/files/restaurant.js");

app.controller('mainCtrl', function($scope, $http){
	$scope.haveCoords = false;
	$scope.haveSearchRes = false;
	$scope.searchParam = null;
	$scope.rests = [];

	var allNames = ['1000 SPIRITS', 'HANOVER GOURMET DELI', 'YORGANIC', 'RESTAURANT ANNISA'];

	var filterByCount = function(length){
		var filt = [];
		for (let i = 0; i < allNames.length; i++){
			if (allNames[i].split(' ').length == length){
				filt.push(allNames[i]);
			}
		}
		return filt;
	}

	var distincts = function(a){
		var dists = [];
		for (let i = 0; i < a.length; i++){
			if (!(a[i] in dists)){
				dists.push(a[i]);
			}
		}
		return dists;
	}

	var overallCharMatches = function(byCount, inp){
		let dinp = distincts(inp);
		var passed = [];
		for (let i = 0; i < byCount.length; i++){
			let dis = distincts(byCount[i]);
			let faults = 0;
			for (let j = 0; j < dis.length; j++){
				if (!(dis[j] in dinp)){
					faults++;
					if (faults == 3){
						break;
					}
				}
			}
			if (faults < 3){
				passed.push(byCount[i]);
			}
		}
		return passed;
	}

	var getSim = function(a){
		let length = a.split(' ').length;
		return filterByCount(length);
		//return overallCharMatches(byCount, a);
	}	

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
			var par = {
				method: 'GET',
				url: gu + '/api?name=' + $scope.searchParam
			}
			$http(par).then(function success(response){
				console.log(response);
				$scope.rests.push(response.data);
				$scope.haveSearchRes = true;
			}, function failure(response){
				console.log("Failure: " + response);
			})
	}
});

