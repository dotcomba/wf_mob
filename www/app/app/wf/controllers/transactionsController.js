'use strict';
app.controller('transactionsController', ['$scope', '$routeParams', '$location', '$timeout', '$route', 'authService', 'transactionsService', 'accountsService', 'categoriesService', 'currenciesService', function ($scope, $routeParams, $location, $timeout, $route, $authService, transactionsService, accountsService, categoriesService, currenciesService) {

    // Method to Insert
    $scope.createTransaction = function (transactionCode) {
        $scope.transaction.transactionCode = transactionCode;
        transactionsService.createTransaction($scope.transaction).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Transaction has been created!";
            startTimer();
            initFields();
        },
         function (response) {
            if (response.status == 400)
                $scope.message = "Error in process of creating: " + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = "Error in process of creating: " + errors.join(' ');
            }
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
        _accountsLoad();
        $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            //$location.path('/dashboard');
            $route.reload();
        }, 2000);
    }

    var startInitTimer = function () {
        var timer = $timeout(function () {
        //
        if ($authService.authentication.isAuth)
        {
        _transactionsLoad();
        _accountsLoad();
        _categoriesLoad();
        _currenciesLoad();
        }
        else startInitTimer();

        }, 100);
    }

    var initFields = function () 
    {
        $scope.transaction = {
            accountSourceId: '',
            accountDestinationId: '',
            categoryId: 'null',
            currencyCode: $scope.homeCurrency,
            transactionValue: '',
            transactionCode: 'TRAN'
        };
    }


    $scope.categories = [];
    $scope.categoriesLookup = {};

    $scope.currencies = [];
    $scope.homeCurrency = '';

    var _currenciesLoad = function()
    {
    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;

            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;

            initFields();

        }, function (error) {
            $scope.message = "Error on loading!";
        });
    }

    // initialization and load
    $scope.transactions = [];

    $scope.accounts = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";

    initFields();

    startInitTimer();

    var _categoriesLoad = function()
    {
    categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;

    for (var i = 0, len = $scope.categories.length; i < len; i++) {
        $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
        }

        }, function (error) {
            $scope.message = "Error on loading of categories!";
        });
    }

    var _accountsLoad = function()
    {
            accountsService.getAccounts().then(function (results) {
            $scope.accounts = results.data;
        }, function (error) {
            $scope.message = "Error on loading of accounts!";
        });
    }

    var _transactionsLoad = function()
    {
         transactionsService.getTransactions().then(function (results) {
            $scope.transactions = results.data;
        }, function (error) {
            $scope.message = "Error on loading of transactions!";
        });
    }
    // ....
}]);


