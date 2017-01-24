'use strict';
app.controller('reportTrendsController', ['$scope', '$routeParams', '$location', '$timeout', '$route', 'dashboardService', 'currenciesService', function ($scope, $routeParams, $location, $timeout, $route, dashboardService, currenciesService) {

  $scope.trends = [];
  $scope.series = ['Incomes', 'Expensises'];
  $scope.monthLookup = ["","January", "February", "March", "April", "May", "June", "July","August","September","Octomber","November","December"];

  $scope.labels = [];
  $scope.data = [[],[]];

  $scope.message = "";
  $scope.dashboard = {};

    $scope.go = function ( path ) {
      $location.path( path );
    };

    $scope.currencies = [];
    $scope.homeCurrency = '';

    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;
            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;
        }, function (error) {
            $scope.message = "Error on loading!";
        });

  dashboardService.getDashboard().then(function (results) {
            $scope.dashboard = results.data;
        }, function (error) {
            $scope.message = "Error on loading!";
        });

  dashboardService.getTrends().then(function (results) {
            $scope.trends = results.data;

            angular.forEach($scope.trends, function(obj) {
                    this.push($scope.monthLookup[obj.month] + ' ' + obj.year);
            }, $scope.labels);

            angular.forEach($scope.trends, function(obj) {
                    this.push(obj.income);
            }, $scope.data[0]);

            angular.forEach($scope.trends, function(obj) {
                    this.push(obj.outcome);
            }, $scope.data[1]);


        }, function (error) {
            $scope.message = "Error on loading!";
        });

  // ....
}]);


