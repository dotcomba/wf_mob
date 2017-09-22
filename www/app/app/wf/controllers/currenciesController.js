'use strict';
app.controller('currenciesController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'currenciesService', 'settingsService', '$translate', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, currenciesService, settingsService, $translate) {

    // Method to Insert
    $scope.createCurrency = function () {

        currenciesService.createCurrency($scope.currency).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.currency_has_been_created; //"Currency has been created!";
            startTimer();
            initFields();
        },
         function (response) {
            if (response.status == 400)
                $scope.message = $scope.translations.error_in_process_of_creating //"Error in process of creating: "
                    + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.error_in_process_of_creating //"Error in process of creating: "
                     + errors.join(' ');
            }
            startErrorTimer();
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
        $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $rootScope.$broadcast('neadTRANReload', '');
            $route.reload();
        }, 500);
    }

    var startErrorTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
        }, 12000);
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
            $scope.message = $scope.translations.currency_info_has_been_updated; //"Currency info has been updated!";
            startTimer();

        },
         function (response) {
            if (response.status == 400)
                $scope.message = $scope.translations.error_on_currency_updating  //"Error in process of updating: "
                    + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.error_on_currency_updating //"Error on category updating: "
                     + errors.join(' ');
            }
            startErrorTimer();
         });
    };

    $scope.removeCurrency = function ()
    {
      currenciesService.deleteCurrency($scope.currency.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = $scope.translations.currency_has_been_removed; //"Currency has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = $scope.translations.error_on_currency_deleting //"Error on currency deleting: "
                        + err;
                    startErrorTimer();
                });
    }

    // initialization and load
    $scope.currencies = [];
    $scope.currencyList = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.homeCurrency = '';

    $scope.translations = [];
    $scope.settings = {};
    settingsService.getUserLang().then(function (results) {
        if (results.data) { $scope.settings = results.data }
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading', 'error_in_process_of_creating', 'error_on_currency_deleting',
    'currency_has_been_removed', 'error_on_currency_updating', 'currency_info_has_been_updated', 'currency_has_been_created']).then(function (translations) {
        $scope.translations = translations;
    }, null);

    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;

            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;

            initFields();

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });

    $scope.currencyWizardList = [];

    currenciesService.getCurrencyList().then(function (results) {
        $scope.currencyList = results.data;

        $scope.currencyWizardList = [];
        angular.forEach(results.data, function (obj) {
            if (obj.code != 'BTC' && obj.code != 'ETH')
                this.push(obj);
        }, $scope.currencyWizardList);

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });


    // ....
}]);