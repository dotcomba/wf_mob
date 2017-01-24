'use strict';
app.controller('currenciesController', ['$scope', '$routeParams', '$location', '$timeout', '$route', '$modal',  'currenciesService', function ($scope, $routeParams, $location, $timeout, $route, $modal, currenciesService) {

    // Method to Insert
    $scope.createCurrency = function () {

        currenciesService.createCurrency($scope.currency).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Currency has been created!";
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
        $scope.currency = {
            homeCurrencyCode: $scope.homeCurrency,
            thirdCurencyCode: '',
            value: 1
        };
    }

    $scope.showModal = function (obj)
    {
        if (obj != null)
        $scope.currency = obj;
        else initFields();

        $('#editCurrencyForm').modal();
    }

    $scope.homeCurrencyModal = function ()
    {
        initFields();

        $('#homeCurrencyForm').modal();
    }

    $scope.saveChanges = function ()
    {
        if ($scope.currency.id == null)
            $scope.createCurrency();
         else $scope.updateCurrency();
    }

    $scope.saveHomeCurrency = function ()
    {
        $scope.currency.homeCurrencyCode = $scope.currency.thirdCurencyCode;
        $scope.createCurrency();
    }

    $scope.showRemoveModal = function (obj)
    {
        if (obj != null)
            $scope.currency = obj;

        $('#removeCurrencyForm').modal();
    }

    $scope.updateCurrency = function ()
    {
        currenciesService.updateCurrency($scope.currency.id, $scope.currency).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Currency info has been updated!";
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
                 $scope.message = "Error on category updating: " + errors.join(' ');
            }
         });
    };

    $scope.removeCurrency = function ()
    {
      currenciesService.deleteCurrency($scope.currency.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = "Currency has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = "Error on currency deleting: " + err;
                });
    }

    // initialization and load
    $scope.currencies = [];
    $scope.currencyList = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.homeCurrency = '';



    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;

            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;

            initFields();

        }, function (error) {
            $scope.message = "Error on loading!";
        });



    currenciesService.getCurrencyList().then(function (results) {
            $scope.currencyList = results.data;
        }, function (error) {
            $scope.message = "Error on loading!";
        });


    // ....
}]);