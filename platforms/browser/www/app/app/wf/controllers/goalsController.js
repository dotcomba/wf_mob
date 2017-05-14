'use strict';
app.controller('goalsController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'goalsService', 'settingsService', '$translate', 'accountsService', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, goalsService, settingsService, $translate, accountsService) {

    // Method to Insert
    $scope.createGoal = function () {

        goalsService.createGoal($scope.goal).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Goal has been created!";
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
        $scope.goal = {
            title: '',
            sourceId: '',
            sourcePercent: '',
            goalAmount: '',
            currencyCode: 'USD',
            displayOnDashboard:true,
            notifyOverdue: true,
            notifyOverdueDays: 2,
            goalDate: new Date((new Date()).setHours(0, 0, 0, 0))
        };
    }

    $scope.showModal = function (obj)
    {
        if (obj != null) {
            if (obj.goalDate != null)
                obj.goalDate = new Date(obj.goalDate);
            $scope.goal = obj;
        }
        else initFields();

        $('#editGoalForm').modal();
    }

    $scope.saveChanges = function ()
    {
        if ($scope.goal.id == null)
            $scope.createGoal();
         else $scope.updateGoal();
    }

    $scope.showRemoveModal = function (obj)
    {
        if (obj != null) {
            if (obj.goalDate != null)
                obj.goalDate = new Date(obj.goalDate);
            $scope.goal = obj;
        }

        $('#removeGoalForm').modal();
    }

    $scope.updateGoal = function ()
    {
        goalsService.updateGoal($scope.goal.id, $scope.goal).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.goal_Goal_info_has_been_updated //"Goal info has been updated!";
            startTimer();

        },
         function (response) {
            if (response.status == 400)
                $scope.message = $scope.translations.goal_Error_in_process_of_updating //"Error in process of updating: " 
                    + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.goal_Error_in_process_of_updating //"Error on goal updating: "
                     + errors.join(' ');
            }
            startErrorTimer();
         });
    };

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
                 $scope.message = $scope.translations.goals_Error_in_process_of_updating_goal_s_state //"Error on goal state updating: "
									+ errors.join(' ');
             }
             startErrorTimer();
         });
    };

    $scope.removeGoal = function ()
    {
      goalsService.deleteGoal($scope.goal.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = $scope.translations.goals_Goal_has_been_removed //"Goal has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = $scope.translations.goals_Error_on_goal_deleting //"Error on goal deleting: " 
                        + err;
                    startErrorTimer();
                });
    }

    // initialization and load
    $scope.goals = [];
    $scope.goalsTotals = { onGoals: 0, failed: 0, completed: 0, homeCurrency: 'USD' };
    $scope.accounts = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";

    initFields();

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading', 'error_in_process_of_creating', 'transactions_Error_on_loading_of_accounts',
    'goal_Error_in_process_of_updating', 'goal_Goal_info_has_been_updated',
    'goals_Error_in_process_of_updating_goal_s_state',
    'goals_Goal_has_been_removed', 'goals_Error_on_goal_deleting']).then(function (translations) {
    $scope.translations = translations;
    }, null);

    goalsService.getGoalsTotals().then(function (results) {
        $scope.goalsTotals = results.data;
    }, function (error) {
        $scope.message = $scope.translations.error_on_loading; //"Error on loading!";             
        startErrorTimer();
    });

    goalsService.getGoalsList().then(function (results) {
            $scope.goals = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";             
            startErrorTimer();
        });

    accountsService.getAccounts().then(function (results) {
        $scope.accounts = results.data;
    }, function (error) {
        $scope.message = $scope.translations.transactions_Error_on_loading_of_accounts; //"Error on loading of accounts!";
        startInitTimer();
    });



    // ....
}]);


