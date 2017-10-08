'use strict';
app.controller('accountsController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'accountsService', 'currenciesService', 'settingsService', '$translate', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, accountsService, currenciesService, settingsService, $translate) {

    $scope.accountTypes = [{ code: null, title: 'Virtual' }, { code: 'BCH', title: 'Blockchain' }];
    $scope.cryptoAccountTypes = [{ code: 'BCH', title: 'Blockchain' }];

    // Method to Insert
    $scope.createAccount = function () {

        accountsService.createAccount($scope.account).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.account_has_been_created; //"Account has been created!";
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
            $rootScope.$broadcast('neadBILLReload', '');
            $rootScope.$broadcast('neadCALENDARReload', '');
            $route.reload();
        }, 2200);
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
        $scope.account = {
            accountType:'BCH',
            title: '',
            currencyCode: 'BTC',
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
            $scope.message = $scope.translations.account_info_has_been_updated; //"Account info has been updated!";
            startTimer();

        },
         function (response) {
            if (response.status == 400)
                $scope.message = $scope.translations.error_in_process_of_updating //"Error in process of updating: " 
                    + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.error_on_account_updating //"Error on account updating: "
                     + errors.join(' ');
            }
            startErrorTimer();
         });
    };

    $scope.removeAccount = function ()
    {
      accountsService.deleteAccount($scope.account.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = $scope.translations.account_has_been_removed; //"Account has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = $scope.translations.error_on_account_deleting //"Error on account deleting: " 
                        + err;
                    startErrorTimer();
                });
    }

    // initialization and load
    $scope.accounts = [];
    $scope.accountsHome = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";

    initFields();

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data) { $scope.settings = results.data }
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading', 'Error_on_account_deleting',
'account_has_been_removed', 'error_on_account_updating', 'error_in_process_of_updating',
    'account_info_has_been_updated','error_in_process_of_creating','account_has_been_created']).then(function (translations) {
    $scope.translations = translations;
}, null);

    accountsService.getAccounts().then(function (results) {
            $scope.accounts = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";             
            startErrorTimer();
        });

    accountsService.getAccountsHome().then(function (results) {
            $scope.accountsHome = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });

    $scope.currencies = [];
    $scope.cryptoCurrencies = [];
    $scope.homeCurrency = '';

    currenciesService.getCurrencies().then(function (results) {
        $scope.currencies = results.data;

        $scope.cryptoCurrencies = [];

        angular.forEach(results.data, function (obj) {
            if (obj.thirdCurencyCode != 'USD' && obj.thirdCurencyCode != 'EUR' && obj.thirdCurencyCode != 'RUB' && obj.thirdCurencyCode != 'UAH' && obj.thirdCurencyCode != 'CAD' && obj.thirdCurencyCode != 'GBP') this.push(obj);
        }, $scope.cryptoCurrencies);

            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });

    // ....
}]);


