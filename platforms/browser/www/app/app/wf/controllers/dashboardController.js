'use strict';
app.controller('dashboardController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'settingsService', 'dashboardService', 'transactionsService', 'accountsService', 'categoriesService', 'authService', 'currenciesService', '$translate', 'goalsService', 'calendarService', 'budgetService', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, settingsService, dashboardService, transactionsService, accountsService, categoriesService, $authService, currenciesService, $translate, goalsService, calendarService, budgetService) {

    // initialization and load
    $scope.transactions = [];
    $scope.accounts = [];
    $scope.accountsHome = [];
    $scope.accountsLookup = {};
    $scope.message = "";
    $scope.dashboard = {};
    $scope.goals = [];
    $scope.goalsEvents = [];
    $scope.goalsDefault = [];
    $scope.calendarEvents = [];

    $scope.currencies = [];
    $scope.homeCurrency = '';

    $scope.go = function ( path ) {
      $location.path( path );
    };
	
    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading', 'error_in_process_updating_user_settings',
	'error_on_settings_updating', 'error_on_loading_of_categories', 'goals_Error_in_process_of_updating_goal_s_state',
    'calendar_Event_has_been_rejected', 'calendar_Event_has_been_executed',
    'calendar_Error_in_process_of_executing_of_payment', 'calendar_Error']).then(function (translations) {
        $scope.translations = translations;
    }, null);

    currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;

            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;

            if ($scope.currencies.length == 0)
            {
                $location.path('/wizard/page/1');
            }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });

    $scope.settings = {};

    settingsService.getUserSettings().then(function (results) {
        $scope.settings = results.data;

        if ($scope.settings.isGoalsWP) getGoals();
        if ($scope.settings.isCalendarWP) getDashboardEvents();
        if ($scope.settings.isBudgetWP) getDashboardBudget();
    }, function (error) {

        $scope.settings = {
            id: 'null',
            userId: $authService.authentication.userName,
            isLatestTransactionWP: true,
            isTrendsWP: true,
            isBalanceWP: true,
            isTransactionLogWP: true,
            avatarNumber: 0,
            userLang: 'en',
            subscriptionType: 'WORLD',
            isGoalsWP: false,
            isCalendarWP: false,
            isBudgetWP: false
        };
        updateUserSettings();

        //$scope.message = "Error on loading!";
    });

    var updateUserSettings = function () {
        settingsService.updateUserSettings($scope.settings.id, $scope.settings).then(function (response) {

            ;

        },
         function (response) {
             if (response.status == 400)
                 $scope.message = $scope.translations.error_in_process_updating_user_settings //"Error in process of updating user settings: " 
									+ response.data.message;
             else {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.error_on_settings_updating //"Error on settings updating: " 
									+ errors.join(' ');
             }
             startErrorTimer();
         });
    };

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

    $scope.categories = [];
    $scope.categoriesLookup = {};

    categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;

            if ($scope.categories.length == 0)
            {
                $location.path('/wizard/page/1');
            }

            for (var i = 0, len = $scope.categories.length; i < len; i++) {
                    $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
            }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading_of_categories; //"Error on loading of categories!";
            startReloadTimer();
        });

    accountsService.getAccounts().then(function (results) {
            $scope.accounts = results.data;

            if ($scope.accounts.length == 0)
            {
                $location.path('/wizard/page/1');
            }

    for (var i = 0, len = $scope.accounts.length; i < len; i++) {
        $scope.accountsLookup[$scope.accounts[i].id] = $scope.accounts[i];
        }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startReloadTimer();
        });

    accountsService.getAccountsHome().then(function (results) {
            $scope.accountsHome = results.data;

            angular.forEach($scope.accountsHome, function(obj) {
              this.push(obj.title.substring(0,15));
            }, $scope.labels);

            angular.forEach($scope.accountsHome, function(obj) {
              this.push(obj.ammount);
            }, $scope.data);

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startReloadTimer();
        });

    dashboardService.getDashboard().then(function (results) {
            $scope.dashboard = results.data;
            $scope.options1.title.text = $scope.homeCurrency + ' ' + $scope.dashboard.balanceValue;
            if ($scope.dashboard.balanceValue == 0)
                introJs().setOptions(Config.get('tour')).start();
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startReloadTimer();
        });

    transactionsService.getTransactions().then(function (results) {
            $scope.transactions = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startReloadTimer();
        });

    var getDashboardEvents = function () {
        calendarService.getDashboardEvents().then(function (results) {
            $scope.calendarEvents = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            //startReloadTimer();
        });
    }

    $scope.executeEvent = function (event)
    {
        if (event != null)
            $scope.ccEvent = event;

        $('#executeEventForm').modal();
    }

    $scope.invokeEvent = function (obj, operation) {
        calendarService.invokeEvent(obj.id, obj, operation).then(function (response) {

            if (operation == 'REJECT')
                $scope.message = $scope.translations.calendar_Event_has_been_rejected; //"Event has been rejected";
            else $scope.message = $scope.translations.calendar_Event_has_been_executed; //"Event has been executed";
            $scope.savedSuccessfully = true;
            $rootScope.$broadcast('neadTRANReload', '');
            startReloadTimer();
        },
         function (response) {
             if (response.status == 500 && response.data.innerException.innerException.exceptionMessage != null)
                 $scope.message = $scope.translations.calendar_Error //"Error: "
									+ response.data.innerException.innerException.exceptionMessage;
             else if (response.status == 400)
                 $scope.message = $scope.translations.calendar_Error_in_process_of_executing_of_payment //"Error in process of executing of payment: " 
									+ response.data.message;
             else {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.calendar_Error_in_process_of_executing_of_payment //"Error in process of executing of payment: "
									+ errors.join(' ');
             }
             startErrorTimer();
         });
    };

    var getGoals = function () {
        goalsService.getGoals().then(function (results) {
            $scope.goals = results.data;

            angular.forEach($scope.goals, function (obj) {
                if (obj.goalDisplayType == 'DONE' || obj.goalDisplayType == 'OVERDUE')
                    this.push(obj);
            }, $scope.goalsEvents);

            angular.forEach($scope.goals, function (obj) {
                if (obj.goalDisplayType == 'DEFAULT' || obj.goalDisplayType == 'RED')
                    this.push(obj);
            }, $scope.goalsDefault);

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startReloadTimer();
        });
    }

    $scope.budgetDashboard = [];

    var getDashboardBudget = function () {
        budgetService.getBudgetDashboard().then(function (results) {
            $scope.budgetDashboard = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            //startReloadTimer();
        });
    }

    var startReloadTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            //$location.path('/dashboard');
            $route.reload();
        }, 2000);
    }

    var startErrorTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
        }, 12000);
    }

    $scope.updateStateGoal = function (goal, state) {
        goal.state = state;
        goalsService.updateStateGoal(goal.id, goal).then(function (response) {

            $route.reload();

        },
         function (response) {
             if (response.status == 400)
                 $scope.message = $scope.translations.goals_Error_in_process_of_updating_goal_s_state //"Error in process of updating goal's state: " 
									+ response.data.message;
             else {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.goals_Error_in_process_of_updating_goal_s_state  //"Error on goal state updating: " 
									+ errors.join(' ');
             }
             startErrorTimer();
         });
    };


    // ....
}]);


