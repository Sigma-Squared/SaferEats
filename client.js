'use strict';
var app = angular.module('mainApp', []);
//global url
//var gu = 'http://192.168.2.220';
var gu = ""; //'http://almogo.noip.me';

//const Restaurant = require(gu + "/files/restaurant.js");

app.filter('firstUp', function() {
    return function(input) {
        input = input || "";
        var outAr = input.split(' ');
        var out = "";
        //console.log(outAr);
        for (let i = 0; i < outAr.length; i++) {
            let r = outAr[i].charAt(0).toString().toUpperCase() + outAr[i].substr(1).toLowerCase();
            out = out + r + " ";
        }
        return out;
    }
});

app.controller('mainCtrl', function($scope, $http) {
    $scope.haveCoords = false;
    $scope.haveSearchRes = false;
    $scope.searchParam = null;
    $scope.rests = [];
	$scope.sorter = 'name';
	$scope.sortIndex = 0;
	$scope.longitude = null;
	$scope.latitude = null;
	
	$scope.satisfaction = function(ob){
		return !ob.localeCompare("Unsatisfactory");
	}

    $scope.getLoc = function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $scope.$apply(function() {
					$scope.longitude = position.coords.longitude;
					$scope.latitude = position.coords.latitude;
                    console.log(position);
                });
            });
        }
    }
	
	$scope.areaSearch = function(){
		if ($scope.latitude != null && $scope.longitude != null){
			var par = {
				method: 'GET',
				url: '/area?lat=' + $scope.latitude + '&long=' + $scope.longitude + '&dist=' + ($scope.radius * 1000)
			}
			$http(par).then(function success(response){
				
				//Success
				$scope.rests = [];
				$scope.haveSearchRes = false;
				
				console.log("Area search");
				//console.log(response);
				if (response.data != null) {
					for (let j = 0; j < response.data.length; j++) {
						$scope.rests.push(response.data[j]);
					}
					$scope.haveSearchRes = true;
					
					for (let j = 0; j < $scope.rests.length ; j++){
						if ($scope.rests[j].violations != null){
							for (let k = 0; k < $scope.rests[j].violations.length; k++){
								$scope.rests[j].violations[k].score = parseInt($scope.rests[j].violations[k].score);
								$scope.rests[j].violations[k].closed = ($scope.rests[j].violations[k].closed === "true");//Boolean($scope.rests[j].violations[k].closed);
							}
						}
					}
					
					console.log($scope.rests);
					
				} else {
					alert("Could not find nearby restaurants");
				}
				
			}, function failure(response){
				//Failure
				console.log("Failure: " + response);
			});
		}
		else {
			alert("Improper inputs");
		}
	}
	
	$scope.reco = function(res, num){
		
		var cleanName = res.name.replace("&", "ORIALMOG");
		
		var par = {
			method: 'GET',
			url: '/reco?recom=' + num + '&name=' + cleanName
		}
		$http(par).then(function success(response){
			
			res.reco += num;
			
		}, function failure(response){
			
			alert("Could not vote!");
			
		});
	}
	
	$scope.fillDefault = function(){
		$scope.longitude = -121.9910337;
		$scope.latitude = 47.2027651;
	}
	
	$scope.isSortIndex = function(num){
		return ($scope.sortIndex == num);
	}
	
	$scope.clearSort = function(){
		$scope.sortIndex = 0;
        $scope.rests = [];
        $scope.haveSearchRes = false;
		$scope.searchParam = null;
		$scope.longitude = null;
		$scope.latitude =null;
		$scope.radius = 1;
	}
	
	$scope.sortBy = function(by){
		$scope.sortIndex = by;
		switch(by){
			case 0:
				$scope.sorter = "name";
				break;
			case 1:
				$scope.sorter = "-name";
				break;
			case 2:
				$scope.sorter = "-reco";
				break;
			case 3:
				$scope.sorter = "violations.length";
				break;
			case 4:
				$scope.sorter = "-violations.length";
				break;
		}
	}

    $scope.search = function() {
        $scope.rests = [];
        $scope.haveSearchRes = false;
		if ($scope.searchParam.length > 2){
			var par = {
				method: 'GET',
				url: gu + '/mults?substr=' + $scope.searchParam
			}
			$http(par).then(function success(response) {
				//console.log(response);
				//console.log(response.data);
				if (response.data != null) {
					for (let j = 0; j < response.data.length; j++) {
						$scope.rests.push(response.data[j]);
					}
					$scope.haveSearchRes = true;
					
					for (let j = 0; j < $scope.rests.length ; j++){
						if ($scope.rests[j].violations != null){
							for (let k = 0; k < $scope.rests[j].violations.length; k++){
								$scope.rests[j].violations[k].score = parseInt($scope.rests[j].violations[k].score);
								$scope.rests[j].violations[k].closed = ($scope.rests[j].violations[k].closed === "true");//Boolean($scope.rests[j].violations[k].closed);
							}
						}
					}
					
					console.log($scope.rests);
					
					
				} else {
					//Note: This only works for requests arrays of length ONE
					alert("Could not find restaurant");
				}
				//console.log($scope.rests);
			}, function failure(response) {
				console.log("Failure: " + response);
			});
		}
		else {
			alert("Search must be 3 or more characters");
		}
    }
});