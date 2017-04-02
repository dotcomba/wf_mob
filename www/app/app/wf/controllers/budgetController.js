'use strict';
app.controller('budgetController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'budgetService', 'currenciesService', 'settingsService', '$translate', 'categoriesService', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, budgetService, currenciesService, settingsService, $translate, categoriesService) {

    // Method to Insert
    $scope.createBudget = function () {

        budgetService.createBudget($scope.budgetItem).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.budget_Item_has_been_created; //"Item has been created!";
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

    var initFields = function () {
        $scope.budgetItem = {
            categoryId: '',
            budgetType: 'EXP',
            currencyCode: $scope.homeCurrency,
            ammount: 0,
            isDistribution: false,
            isActive: true
        };
    }

    $scope.budgetTypes = [ { id: 'EXP', title: 'Expense' }, { id: 'INC', title: 'Income' } ]

    $scope.showModal = function (obj)
    {
        if (obj != null)
            $scope.budgetItem = obj;
        else initFields();

        $('#editBudgetForm').modal();
    }

    $scope.saveChanges = function ()
    {
        if ($scope.budgetItem.id == null)
            $scope.createBudget();
         else $scope.updateBudget();
    }

    $scope.showRemoveModal = function (obj)
    {
        if (obj != null)
            $scope.budgetItem = obj;

        $('#removeBudgetForm').modal();
    }

    $scope.updateBudget = function ()
    {
        budgetService.updateBudget($scope.budgetItem.id, $scope.budgetItem).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.budget_Item_has_been_updated;//"Item has been updated!";
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
                 $scope.message = $scope.translations.error_in_process_of_updating //"Error on account updating: "
                     + errors.join(' ');
            }
            startErrorTimer();
         });
    };

    $scope.removeBudget = function ()
    {
      budgetService.deleteBudget($scope.budgetItem.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = $scope.translations.budget_Item_has_been_removed; //"Item has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = $scope.translations.budget_Error_on_item_deleting  //"Error on item deleting: " 
                        + err;
                    startErrorTimer();
                });
    }

    // initialization and load
    $scope.budgets = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";


    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading', 'error_in_process_of_updating',
    'error_in_process_of_creating', 'budget_Item_has_been_created',
    'budget_Item_has_been_removed', 'budget_Error_on_item_deleting',
    'budget_Item_has_been_updated']).then(function (translations) {
    $scope.translations = translations;
}, null);

    budgetService.getBudgets().then(function (results) {
            $scope.budgets = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";             
            startErrorTimer();
        });

    $scope.currencies = [];
    $scope.homeCurrency = 'USD';

    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;
            if ($scope.currencies.length > 0) {
                $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;
            }
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });


    initFields();

    $scope.categories = [];
    $scope.categoriesLookup = {};

    categoriesService.getCategories().then(function (results) {
        $scope.categories = results.data;

        for (var i = 0, len = $scope.categories.length; i < len; i++) {
            $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
        }

    }, function (error) {
        $scope.message = $scope.translations.error_on_loading;
        startErrorTimer();
    });

    // ....
}]);


