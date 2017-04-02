'use strict';
app.controller('allstufController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', 'authService', 'transactionsService', 'accountsService', 'categoriesService', 'settingsService', '$translate', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $authService, transactionsService, accountsService, categoriesService, settingsService, $translate) {

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

    $translate(['error_on_loading', 'error_in_process_of_canceling_transaction', 'transaction_has_been_canceled']).then(function (translations) {
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

        $scope.savedSuccessfully = false;
        $scope.message = "";

        var startTimer = function () {
            var timer = $timeout(function () {
                $scope.savedSuccessfully = false;
                $scope.message = "";
                $rootScope.$broadcast('neadTRANReload', '');
                $timeout.cancel(timer);
                $route.reload();
            }, 1000);
        }

        var startErrorTimer = function () {
            var timer = $timeout(function () {
                $scope.savedSuccessfully = false;
                $scope.message = "";
                $timeout.cancel(timer);
            }, 5000);
        }

        $scope.transaction = {};

        $scope.showCancelModal = function (obj) {
            if (obj != null)
                $scope.transaction = obj;

            $('#cancelTransactionForm').modal();
        }

        $scope.cancelTransaction = function () {
            transactionsService.cancelTransaction($scope.transaction.id, $scope.transaction).then(function (response) {

                 $scope.savedSuccessfully = true;
                 $scope.message = $scope.translations.transaction_has_been_canceled; //"Transaction has been canceled";
                 startTimer();

             },
              function (response) {
                  if (response.status == 400)
                      $scope.message = $scope.translations.error_in_process_of_canceling_transaction //"Error in process of canceling transaction: " 
                          + response.data.message;
                  else {
                      var errors = [];
                      for (var key in response.data.modelState) {
                          for (var i = 0; i < response.data.modelState[key].length; i++) {
                              errors.push(response.data.modelState[key][i]);
                          }
                      }
                      $scope.message = $scope.translations.error_in_process_of_canceling_transaction //"Error in process of canceling transaction: " 
                          + errors.join(' ');
                  }
                  startErrorTimer();
              });
         };
    // ....
}]);


