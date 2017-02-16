'use strict';
app.controller('reportTrendsController', ['$scope', '$routeParams', '$location', '$timeout', '$route', 'dashboardService', 'currenciesService', 'settingsService', '$translate', function ($scope, $routeParams, $location, $timeout, $route, dashboardService, currenciesService, settingsService, $translate) {

    $scope.trends = [];

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading', 'incomes', 'expenses',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'octomber', 'november', 'december']).then(function (translations) {
        $scope.translations = translations;

        $scope.series = [$scope.translations.incomes, $scope.translations.expenses];
        $scope.monthLookup = ["", $scope.translations.january, $scope.translations.february, $scope.translations.march,
    $scope.translations.april, $scope.translations.may, $scope.translations.june, $scope.translations.july,
    $scope.translations.august, $scope.translations.september, $scope.translations.octomber, $scope.translations.november, $scope.translations.december];

    }, null);

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
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
        });

  dashboardService.getDashboard().then(function (results) {
            $scope.dashboard = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
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
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
        });

  // ....
}]);


