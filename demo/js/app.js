'use strict';

var myApp = angular.module('myapp', ['angular-slidezilla'])

myApp.controller('sliderdemo', ['$scope',function($scope){

    //set slider value as a number to have 1 slider
    //all properties default values
    $scope.slider1 = {val:5};
    
    //set slider value as a number to have 1 slider
    // properties defined in html
    $scope.slider2 = {val:-7};
    
    //set slider value as a number to have 1 slider
    // properties defined below
    $scope.slider3 = {
        val:5.5,
        min: 0,
        max: 10,
        step: 0.5
    };
    
    //set value as an array to have 2 sliders
    $scope.slider4 = { val:[5,20] };

}]);
