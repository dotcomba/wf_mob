'use strict';
app.controller('reportExpensisesController', ['$scope', '$routeParams', '$location', '$timeout', '$route', 'transactionsService', 'categoriesService', 'currenciesService', 'settingsService', '$translate', function ($scope, $routeParams, $location, $timeout, $route, transactionsService, categoriesService, currenciesService, settingsService, $translate) {

    $scope.categories = [];
    $scope.categoriesLookup = {};
    $scope.transactions = [];
    $scope.message = "";

    $scope.periods = [];
    $scope.currentPeriod = '';

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading',
    'january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'octomber', 'november', 'december']).then(function (translations) {
        $scope.translations = translations;

        $scope.monthLookup = ["", $scope.translations.january, $scope.translations.february, $scope.translations.march,
    $scope.translations.april, $scope.translations.may, $scope.translations.june, $scope.translations.july,
    $scope.translations.august, $scope.translations.september, $scope.translations.octomber, $scope.translations.november, $scope.translations.december];

    }, null);

    $scope.currencies = [];
    $scope.homeCurrency = '';

    transactionsService.getReportPeriodsExpense().then(function (results) {
        $scope.periods = results.data;
        if ($scope.periods.length > 0) {
            $scope.currentPeriod = $scope.periods[0].month + '|' + $scope.periods[0].year;
            $scope.updatePeriod();
        }

    }, function (error) {
        $scope.message = $scope.translations.error_on_loading; //"Error on loading of expenses periods!";
    });

    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;
            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
        });

    categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;

    for (var i = 0, len = $scope.categories.length; i < len; i++) {
        $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
        }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of categories!";
        });

 $scope.labels =[];
    $scope.data = []; 

    $scope.options1 = {
        responsive: true,
		title: {
            display: true,
            text:  $scope.homeCurrency + ' ...',
            fontSize: 19,
            position: 'top',
            fontStyle: 'bold',
            fontColor: '#76838f'
        }
    }

    $scope.updatePeriod = function ()
    {
        if ($scope.currentPeriod != '')
        {
            transactionsService.getReportExpensesByPeriod($scope.currentPeriod).then(function (results) {
                $scope.transactions = results.data;

                var total = 0;
                for (var i = 0; i < $scope.transactions.length; i++) {
                    if ($scope.transactions[i].transactionCode == 'EXP')
                        total += $scope.transactions[i].amount;
                }

                $scope.options1.title.text = $scope.homeCurrency + ' ' + total.toFixed(2);

                $scope.labels = []; $scope.data = [];

                angular.forEach($scope.transactions, function (obj) {
                    if (obj.transactionCode == 'EXP')
                        this.push($scope.categoriesLookup[obj.categoryId].title);
                }, $scope.labels);

                angular.forEach($scope.transactions, function (obj) {
                    if (obj.transactionCode == 'EXP')
                        this.push(obj.amount);
                }, $scope.data);

            }, function (error) {
                $scope.message = $scope.translations.error_on_loading; //"Error on loading of transactions!";
            });
        }
    }

        // transactionsService.getReportExpensisesTransactions().then(function (results) {
        //    $scope.transactions = results.data;

        //    var total = 0;
        //    for(var i = 0; i < $scope.transactions.length; i++){
        //        if ($scope.transactions[i].transactionCode == 'EXP')
        //            total += $scope.transactions[i].amount;
        //    }

        //    $scope.options1.title.text = $scope.homeCurrency + ' ' + total.toFixed(2);

        //    angular.forEach($scope.transactions, function(obj) {
        //        if (obj.transactionCode == 'EXP')
        //            this.push($scope.categoriesLookup[obj.categoryId].title);
        //    }, $scope.labels);

        //    angular.forEach($scope.transactions, function(obj) {
        //        if (obj.transactionCode == 'EXP')
        //            this.push(obj.amount);
        //    }, $scope.data);

        //}, function (error) {
        //    $scope.message = "Error on loading of transactions!";
        //});




//



    // ....
}]);


