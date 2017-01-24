'use strict';
app.controller('reportIncomesController', ['$scope', '$routeParams', '$location', '$timeout', '$route', 'transactionsService', 'categoriesService', 'currenciesService', function ($scope, $routeParams, $location, $timeout, $route, transactionsService, categoriesService, currenciesService) {

    $scope.categories = [];
    $scope.categoriesLookup = {};
    $scope.transactions = [];
    $scope.message = "";

    $scope.currencies = [];
    $scope.homeCurrency = '';

    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;
            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;
        }, function (error) {
            $scope.message = "Error on loading!";
        });

    categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;

    for (var i = 0, len = $scope.categories.length; i < len; i++) {
        $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
        }

        }, function (error) {
            $scope.message = "Error on loading of categories!";
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

         transactionsService.getReportIncomeTransactions().then(function (results) {
            $scope.transactions = results.data;

            var total = 0;
            for(var i = 0; i < $scope.transactions.length; i++){
                if ($scope.transactions[i].transactionCode == 'INC')
                    total += $scope.transactions[i].amount;
            }

            $scope.options1.title.text = $scope.homeCurrency + ' ' + total;

            angular.forEach($scope.transactions, function(obj) {
                if (obj.transactionCode == 'INC')
                    this.push($scope.categoriesLookup[obj.categoryId].title);
            }, $scope.labels);

            angular.forEach($scope.transactions, function(obj) {
                if (obj.transactionCode == 'INC')
                    this.push(obj.amount);
            }, $scope.data);

        }, function (error) {
            $scope.message = "Error on loading of transactions!";
        });


//



    // ....
}]);


