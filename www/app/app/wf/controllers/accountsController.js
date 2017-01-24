'use strict';
app.controller('accountsController', ['$scope', '$routeParams', '$location', '$timeout', '$route', '$modal',  'accountsService', 'currenciesService', function ($scope, $routeParams, $location, $timeout, $route, $modal, accountsService, currenciesService) {

    // Method to Insert
    $scope.createAccount = function () {

        accountsService.createAccount($scope.account).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Account has been created!";
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
        $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $route.reload();
        }, 2000);
    }

    var initFields = function () 
    {
        $scope.account = {
            title: '',
            currencyCode: 'USD',
            ammount: 0
        };
    }

    $scope.showModal = function (obj)
    {
        if (obj != null)
        $scope.account = obj;
        else initFields();

        $('#editAccountForm').modal();
    }

    $scope.saveChanges = function ()
    {
        if ($scope.account.id == null)
            $scope.createAccount();
         else $scope.updateAccount();
    }

    $scope.showRemoveModal = function (obj)
    {
        if (obj != null)
            $scope.account = obj;

        $('#removeAccountForm').modal();
    }

    $scope.updateAccount = function ()
    {
        accountsService.updateAccount($scope.account.id, $scope.account).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Account info has been updated!";
            startTimer();

        },
         function (response) {
            if (response.status == 400)
                $scope.message = "Error in process of updating: " + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = "Error on account updating: " + errors.join(' ');
            }
         });
    };

    $scope.removeAccount = function ()
    {
      accountsService.deleteAccount($scope.account.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = "Account has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = "Error on account deleting: " + err;
                });
    }

    // initialization and load
    $scope.accounts = [];
    $scope.accountsHome = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";

    initFields();

    accountsService.getAccounts().then(function (results) {
            $scope.accounts = results.data;
        }, function (error) {
            $scope.message = "Error on loading!";
        });

    accountsService.getAccountsHome().then(function (results) {
            $scope.accountsHome = results.data;
        }, function (error) {
            $scope.message = "Error on loading!";
        });

    $scope.currencies = [];
    $scope.homeCurrency = '';

    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;
            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;
        }, function (error) {
            $scope.message = "Error on loading!";
        });

    // ....
}]);


