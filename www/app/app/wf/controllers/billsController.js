'use strict';
app.controller('billsController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'billsService', 'currenciesService', 'settingsService', '$translate', 'categoriesService', 'accountsService', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, billsService, currenciesService, settingsService, $translate, categoriesService, accountsService) {

    $scope.categories = [];
    $scope.categoriesLookup = {};
    $scope.accounts = [];
    $scope.cryptoAccounts = [];
    $scope.accountsLookup = {};

    var _categoriesLoad = function () {
        categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;

            for (var i = 0, len = $scope.categories.length; i < len; i++) {
                $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
            }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of categories!";
        });
    }

    _categoriesLoad();

    var _accountsLoad = function () {
        accountsService.getAccounts().then(function (results) {
            //$scope.accounts = results.data;
            $scope.accounts = [];
            $scope.cryptoAccounts = [];

            angular.forEach(results.data, function (obj) {
                if (obj.accountType == null) this.push(obj);
            }, $scope.accounts);

            angular.forEach(results.data, function (obj) {
                if (obj.accountType == 'BCH') this.push(obj);
            }, $scope.cryptoAccounts);

            for (var i = 0, len = $scope.accounts.length; i < len; i++) {
                $scope.accountsLookup[$scope.accounts[i].id] = $scope.accounts[i];
            }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of accounts!";
        });
    }

    _accountsLoad();

    // Method to Insert
    $scope.createBill = function () {

        billsService.createBill($scope.bill).then(function (response) {

            if (response.status == 200) {
                if (response.data != '')
                    if (response.data.indexOf('Processing error') !== -1) {
                        $scope.message = response.data;
                        startErrorTimer();
                    }
                    else $scope.open_url(response.data);
                else {
                    $scope.savedSuccessfully = true;
                    $scope.message = $scope.translations.bill_has_been_created; //"Bill has been created!";
                    startTimer();
                    initFields();
                }
            }

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
            $route.reload();
        }, 500);
    }

    var startErrorTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $route.reload();
        }, 12000);
    }

    var startTimerResult = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $location.path('/bills');
        }, 10000);
    }

    $scope.open_url = function (processingUrl)
    {
        if (processingUrl.indexOf("http") == -1)
            $location.path(processingUrl);
        else window.location = processingUrl;
    }

    var initFields = function () 
    {
        $scope.bill = {
            currencyCode: 'USD',
            billValue: 0,
            accountSourceId: '',
            categoryId: 'null',
            status: 'NEW',
            payeeNameAndAddress: '',
            payerName: '',
            accountNumber: ''
        };
    }

    $scope.showModal = function (obj)
    {
        if (obj != null)
        $scope.bill = obj;
        else initFields();

        $('#editBillForm').modal();
    }

    $scope.saveChanges = function ()
    {
        if ($scope.bill.id == null)
            $scope.createBill();
         else $scope.updateBill();
    }

    $scope.makePayment = function () {
        $scope.bill.status = 'PROCESSING';
        if ($scope.bill.id == null)
            $scope.createBill();
        else $scope.updateBill();
    }

    $scope.showRemoveModal = function (obj)
    {
        if (obj != null)
            $scope.bill = obj;

        $('#removeBillForm').modal();
    }

    $scope.showViewModal = function (obj) {
        if (obj != null)
            $scope.bill = obj;

        $('#viewBillForm').modal();
    }

    $scope.updateBill = function ()
    {
        billsService.updateBill($scope.bill.id, $scope.bill).then(function (response) {

            if (response.status == 200) {
                if (response.data != '')
                    if (response.data.indexOf('Processing error') !== -1) {
                        $scope.message = response.data;
                        startErrorTimer();
                    }
                    else $scope.open_url(response.data);
                else
                {
                    $scope.savedSuccessfully = true;
                    $scope.message = $scope.translations.bill_info_has_been_updated; //"Account info has been updated!";
                    startTimer();
                }
            }
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

    $scope.removeBill = function ()
    {
      billsService.deleteBill($scope.bill.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = $scope.translations.bill_has_been_removed; //"Account has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = $scope.translations.error_on_bill_deleting //"Error on account deleting: " 
                        + err;
                    startErrorTimer();
                });
    }

    // initialization and load
    $scope.bills = [];

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

    $translate(['error_on_loading', 'bill_has_been_created',
'bill_info_has_been_updated', 'bill_has_been_removed', 'error_on_bill_deleting', 'we_encountered_error_in_process_of_paying_your_bill', 'your_bill_has_been_paid_successfully']).then(function (translations) {
    $scope.translations = translations;
}, null);

    var _getBills = function () {
        billsService.getBills().then(function (results) {
            $scope.bills = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";             
            startErrorTimer();
        });
    }

    _getBills();

    $scope.currencies = [];
    $scope.homeCurrency = '';

    var _currenciesLoad = function () {
        currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;
            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });
    }

    _currenciesLoad();

    $scope.billsTotals = { onPayment: 0, failed: 0, confirmed: 0, homeCurrency: 'USD' };

    var _getBillsTotals = function () {
        billsService.getBillsTotals().then(function (results) {
            $scope.billsTotals = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";             
            startErrorTimer();
        });
    }

     _getBillsTotals();

    var resParam = $routeParams.result;
    if (resParam != undefined) {
        if (resParam == 'success') {
            $scope.savedSuccessfully = true;
            $scope.message = "Your bill has been paid successfully"; //$scope.translations.your_bill_has_been_paid_successfully;
            startTimerResult();
        }
        else if (resParam == 'cancel') {
            $scope.savedSuccessfully = false;
            $scope.message = "We encountered error in process of paying your bill"; //$scope.translations.we_encountered_error_in_process_of_paying_your_bill;
            startTimerResult();
        } else if (resParam == 'return') {
            $scope.savedSuccessfully = true;
            $scope.message = "Your bill has been paid"; //$scope.translations.your_bill_has_been_paid_successfully;
            startTimerResult();
        }
    }

    $rootScope.$on('neadBILLReload', function (event, msg) {
        _accountsLoad();
        _categoriesLoad();
        _currenciesLoad();
    });

    // ....
}]);


