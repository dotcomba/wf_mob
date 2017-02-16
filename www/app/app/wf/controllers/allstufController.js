'use strict';
app.controller('allstufController', ['$scope', '$routeParams', '$location', '$timeout', '$route', 'authService', 'transactionsService', 'accountsService', 'categoriesService', 'settingsService', '$translate', function ($scope, $routeParams, $location, $timeout, $route, $authService, transactionsService, accountsService, categoriesService, settingsService, $translate) {

    $scope.categories = [];
    $scope.categoriesLookup = {};
    $scope.transactions = [];
    $scope.accountsLookup = {};
    $scope.accounts = [];
    $scope.message = "";

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading']).then(function (translations) {
    $scope.translations = translations;
}, null);

    categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;

    for (var i = 0, len = $scope.categories.length; i < len; i++) {
        $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
        }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of categories!";
        });

            accountsService.getAccounts().then(function (results) {
                $scope.accounts = results.data;

                for (var i = 0, len = $scope.accounts.length; i < len; i++) {
                    $scope.accountsLookup[$scope.accounts[i].id] = $scope.accounts[i];
                }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of accounts!";
        });

         transactionsService.getAllTransactions().then(function (results) {
            $scope.transactions = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of transactions!";
        });
    // ....
}]);


