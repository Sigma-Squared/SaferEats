//iPhone fix

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
        for (var i = 0; i < outAr.length; i++) {
            var r = outAr[i].charAt(0).toString().toUpperCase() + outAr[i].substr(1).toLowerCase();
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
	
	//Alphabetical A-Z
	$scope.mergeSort_az = function(items){

		if (items.length < 2) {
			return items;
		}

		var middle = Math.floor(items.length / 2);
		var left = items.slice(0, middle);
		var right = items.slice(middle);

		return $scope.merge_az($scope.mergeSort_az(left), $scope.mergeSort_az(right));
	}
	
	$scope.merge_az = function(left, right){
		var result  = [];
		var left_i = 0;
		var right_i = 0;
		
		while (left_i < left.length && right_i < right.length){
			if (left[left_i].name < right[right_i].name){
				result.push(left[left_i++]);
			} else {
				result.push(right[right_i++]);
			}
		}

		return result.concat(left.slice(left_i)).concat(right.slice(right_i));
	}
 
 
	//Alphabetical Z-A
	$scope.mergeSort_za = function(items){

		if (items.length < 2) {
			return items;
		}

		var middle = Math.floor(items.length / 2);
		var left = items.slice(0, middle);
		var right = items.slice(middle);

		return $scope.merge_za($scope.mergeSort_za(left), $scope.mergeSort_za(right));
	}
	
	$scope.merge_za = function(left, right){
		var result  = [];
		var left_i = 0;
		var right_i = 0;
		
		while (left_i < left.length && right_i < right.length){
			if (left[left_i].name > right[right_i].name){
				result.push(left[left_i++]);
			} else {
				result.push(right[right_i++]);
			}
		}

		return result.concat(left.slice(left_i)).concat(right.slice(right_i));
	}
 
 
	//Reco
	$scope.mergeSort_reco = function(items){

		if (items.length < 2) {
			return items;
		}

		var middle = Math.floor(items.length / 2);
		var left = items.slice(0, middle);
		var right = items.slice(middle);

		return $scope.merge_reco($scope.mergeSort_reco(left), $scope.mergeSort_reco(right));
	}
	
	$scope.merge_reco = function(left, right){
		var result  = [];
		var left_i = 0;
		var right_i = 0;
		
		while (left_i < left.length && right_i < right.length){
			if (left[left_i].reco > right[right_i].reco){
				result.push(left[left_i++]);
			} else {
				result.push(right[right_i++]);
			}
		}

		return result.concat(left.slice(left_i)).concat(right.slice(right_i));
	}
 
 
	//Vioaltions Up
 	$scope.mergeSort_vio = function(items){

		if (items.length < 2) {
			return items;
		}

		var middle = Math.floor(items.length / 2);
		var left = items.slice(0, middle);
		var right = items.slice(middle);

		return $scope.merge_vio($scope.mergeSort_vio(left), $scope.mergeSort_vio(right));
	}
	
	$scope.merge_vio = function(left, right){
		var result  = [];
		var left_i = 0;
		var right_i = 0;
		
		while (left_i < left.length && right_i < right.length){
			if (left[left_i].violations.length < right[right_i].violations.length){
				result.push(left[left_i++]);
			} else {
				result.push(right[right_i++]);
			}
		}

		return result.concat(left.slice(left_i)).concat(right.slice(right_i));
	}
 
 
	//Violations down
  	$scope.mergeSort_oiv = function(items){

		if (items.length < 2) {
			return items;
		}

		var middle = Math.floor(items.length / 2);
		var left = items.slice(0, middle);
		var right = items.slice(middle);

		return $scope.merge_oiv($scope.mergeSort_oiv(left), $scope.mergeSort_oiv(right));
	}
	
	$scope.merge_oiv = function(left, right){
		var result  = [];
		var left_i = 0;
		var right_i = 0;
		
		while (left_i < left.length && right_i < right.length){
			if (left[left_i].violations.length > right[right_i].violations.length){
				result.push(left[left_i++]);
			} else {
				result.push(right[right_i++]);
			}
		}

		return result.concat(left.slice(left_i)).concat(right.slice(right_i));
	}
 
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
                url: '/safereats/area?lat=' + $scope.latitude + '&long=' + $scope.longitude + '&dist=' + ($scope.radius * 1000)
            }
            $http(par).then(function success(response){
 
                //Success
                $scope.rests = [];
                $scope.haveSearchRes = false;
 
                console.log("Area search");
                //console.log(response);
                if (response.data != null) {
                    for (var j = 0; j < response.data.length; j++) {
                        $scope.rests.push(response.data[j]);
                    }
                    $scope.haveSearchRes = true;
 
                    for (var j = 0; j < $scope.rests.length ; j++){
                        for (var k = 0; k < $scope.rests[j].violations.length; k++){
                            $scope.rests[j].violations[k].score = parseInt($scope.rests[j].violations[k].score);
                            $scope.rests[j].violations[k].closed = ($scope.rests[j].violations[k].closed === "true");//Boolean($scope.rests[j].violations[k].closed);
                        }
                    }
 
                    console.log($scope.rests);
 
                } else {
                    alert("Could not find nearby restaurants");
                }
 
            }, function faleft_iure(response){
                //Faleft_iure
                console.log("Faleft_iure: " + response);
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
            url: '/safereats/reco?recom=' + num + '&name=' + cleanName
        }
        $http(par).then(function success(response){
 
            res.reco += num;
 
        }, function faleft_iure(response){
 
            alert("Could not vote!");
 
        });
    }
 
    $scope.fleft_ilDefault = function(){
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
    }
 
    $scope.sortBy = function(by){
        $scope.sortIndex = by;
        switch(by){
            case 0:
				$scope.rests = $scope.mergeSort_az($scope.rests);
                //$scope.sorter = "name";
                break;
            case 1:
				$scope.rests = $scope.mergeSort_za($scope.rests);
                //$scope.sorter = "-name";
                break;
            case 2:
				$scope.rests = $scope.mergeSort_reco($scope.rests);
                //$scope.sorter = "-reco";
                break;
            case 3:
				$scope.rests = $scope.mergeSort_vio($scope.rests);
                //$scope.sorter = "violations.length";
                break;
            case 4:
				$scope.rests = $scope.mergeSort_oiv($scope.rests);
                //$scope.sorter = "-violations.length";
                break;
        }
    }
 
    $scope.search = function() {
        $scope.rests = [];
        $scope.haveSearchRes = false;
        var par = {
            method: 'GET',
            url: gu + '/safereats/mults?substr=' + $scope.searchParam
        }
        $http(par).then(function success(response) {
            //console.log(response);
            //console.log(response.data);
            if (response.data != null) {
                for (var j = 0; j < response.data.length; j++) {
                    $scope.rests.push(response.data[j]);
                }
                $scope.haveSearchRes = true;
 
                for (var j = 0; j < $scope.rests.length ; j++){
                    for (var k = 0; k < $scope.rests[j].violations.length; k++){
                        $scope.rests[j].violations[k].score = parseInt($scope.rests[j].violations[k].score);
                        $scope.rests[j].violations[k].closed = ($scope.rests[j].violations[k].closed === "true");//Boolean($scope.rests[j].violations[k].closed);
                    }
                }
 
                console.log($scope.rests);
 
 
            } else {
                //Note: This only works for requests arrays of length ONE
                alert("Could not find restaurant");
            }
            //console.log($scope.rests);
        }, function faleft_iure(response) {
            console.log("Faleft_iure: " + response);
        });
    }
});