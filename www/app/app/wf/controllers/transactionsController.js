'use strict';
app.controller('transactionsController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', 'authService', 'transactionsService', 'accountsService', 'categoriesService', 'currenciesService', 'settingsService', '$translate', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $authService, transactionsService, accountsService, categoriesService, currenciesService, settingsService, $translate) {

    $scope.translations = [];

    var _initTranslations = function () {
        settingsService.getUserLang().then(function (results) {
            if (results.data && results.data.userLang) {
                $translate.use(results.data.userLang);
                $translate.preferredLanguage(results.data.userLang);
            }
        });

        $translate(['transactions_Transaction_has_been_created', 'transactions_Error_in_process_of_creating',
        'transactions_Lack_of_money', 'transactions_Error_on_loading', 'transactions_Error_on_loading_of_categories',
        'transactions_Error_on_loading_of_accounts', 'transactions_Error_on_loading_of_transactions']).then(function (translations) {
            $scope.translations = translations;
        }, null);
    }

    // Method to Insert
    $scope.createTransaction = function (transactionCode) {
        $scope.transaction.transactionCode = transactionCode;
        transactionsService.createTransaction($scope.transaction).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.transactions_Transaction_has_been_created; //"Transaction has been created!";
            startTimer();
            initFields();
        },
         function (response) {
             if (response.status == 400)
                 if (response.data.message.indexOf('Lack of money') != -1)
                     $scope.message = $scope.translations.transactions_Lack_of_money;//'Lack of money to make this transaction. Check amount and try again';
                 else
                     $scope.message = $scope.translations.transactions_Error_in_process_of_creating //"Error in process of creating: " 
				 + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.transactions_Error_in_process_of_creating //"Error in process of creating: " 
				 + errors.join(' ');
             }
             startErrorTimer();
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            _accountsLoad();
            _categoriesLoad();
        $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            //$location.path('/dashboard');
            $route.reload();
        }, 1000);
    }

    var startErrorTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
        }, 12000);
    }

    var startInitTimer = function () {
        var timer = $timeout(function () {
        //
        if ($authService.authentication.isAuth)
        {
        _initTranslations();
        _transactionsLoad();
        _accountsLoad();
        _categoriesLoad();
        _currenciesLoad();
        $scope.savedSuccessfully = false;
        $scope.message = "";
        $timeout.cancel(timer);
        }
        else startInitTimer();

        }, 1000);
    }

    var initFields = function () 
    {
        $scope.transaction = {
            accountSourceId: '',
            accountDestinationId: '',
            categoryId: 'null',
            newCategoryTitle: '',
            currencyCode: $scope.homeCurrency,
            transactionValue: '',
            transactionCode: 'TRAN'
        };

        //categoryCheck('', 'Inc'); categoryCheck('', 'Exp');
        //selectCheck('', 'Inc'); selectCheck('', 'Exp');

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
            $scope.message = $scope.translations.transactions_Error_on_loading; //"Error on loading!";
            startInitTimer();
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
            $scope.message = $scope.translations.transactions_Error_on_loading_of_categories; //"Error on loading of categories!";
            startInitTimer();
        });
    }

    var _accountsLoad = function()
    {
            accountsService.getAccounts().then(function (results) {
            $scope.accounts = results.data;
        }, function (error) {
            $scope.message = $scope.translations.transactions_Error_on_loading_of_accounts; //"Error on loading of accounts!";
            startInitTimer();
        });
    }

    var _transactionsLoad = function()
    {
         transactionsService.getTransactions().then(function (results) {
            $scope.transactions = results.data;
        }, function (error) {
            $scope.message = $scope.translations.transactions_Error_on_loading_of_transactions; //"Error on loading of transactions!";
            startInitTimer();
        });
    }
    // ....
    $rootScope.$on('neadTRANReload', function (event, msg) {
        _accountsLoad();
        _categoriesLoad();
        _currenciesLoad();
    });

    $rootScope.$on('neadTRANAccountSetupExp', function (event, msg) {
        $scope.transaction.accountSourceId = msg;
        $scope.transaction.accountDestinationId = '';
    });

    $rootScope.$on('neadTRANAccountSetupInc', function (event, msg) {
        $scope.transaction.accountDestinationId = msg;
        $scope.transaction.accountSourceId = '';
    });
    

}]);


