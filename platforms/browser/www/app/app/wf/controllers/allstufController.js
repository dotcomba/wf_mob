'use strict';
app.controller('allstufController', ['$scope', '$routeParams', '$location', '$timeout', '$route', 'authService', 'transactionsService', 'accountsService', 'categoriesService',  function ($scope, $routeParams, $location, $timeout, $route, $authService, transactionsService, accountsService, categoriesService) {

    $scope.categories = [];
    $scope.categoriesLookup = {};
    $scope.transactions = [];
    $scope.accounts = [];
    $scope.message = "";

    categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;

    for (var i = 0, len = $scope.categories.length; i < len; i++) {
        $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
        }

        }, function (error) {
            $scope.message = "Error on loading of categories!";
        });

            accountsService.getAccounts().then(function (results) {
            $scope.accounts = results.data;
        }, function (error) {
            $scope.message = "Error on loading of accounts!";
        });

         transactionsService.getAllTransactions().then(function (results) {
            $scope.transactions = results.data;
        }, function (error) {
            $scope.message = "Error on loading of transactions!";
        });
    // ....
}]);


