﻿app.controller('settingsController', ['$scope', '$routeParams', '$rootScope', '$location', '$timeout', '$route', 'authService', 'settingsService', '$translate', function ($scope, $routeParams, $rootScope, $location, $timeout, $route, $authService, settingsService, $translate) {

    var startTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
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

    var initFields = function () {
        $scope.settings = {
            id: 'null',
            userId: $authService.authentication.userName,
            isLatestTransactionWP : true,
            isTrendsWP : false,
            isBalanceWP : true,
            isTransactionLogWP: false,
            avatarNumber: 0,
            userLang: 'en',
            subscriptionType: 'WORLD+',
            isGoalsWP: false,
            isCalendarWP: true,
            isBudgetWP: false,
            isCryptobillWP:true
        };
    }

    var initControls = function ()
    {
        if ($scope.settings.isLatestTransactionWP)
            $("#chBoxLatestTransaction").attr('checked', '');
        if ($scope.settings.isTrendsWP)
            $("#chBoxTrends").attr('checked', '');
        if ($scope.settings.isBalanceWP)
            $("#chBoxBalance").attr('checked', '');
        if ($scope.settings.isTransactionLogWP)
            $("#chBoxTransactionLog").attr('checked', '');
        if ($scope.settings.isGoalsWP)
            $("#chBoxGoals").attr('checked', '');
        if ($scope.settings.isCalendarWP)
            $("#chBoxCalendar").attr('checked', '');
        if ($scope.settings.isBudgetWP)
            $("#chBoxBudget").attr('checked', '');
        if ($scope.settings.isCryptobillWP)
            $("#chBoxCryptobill").attr('checked', '');
        //$("#btnFinish").removeAttr('checked');
    }

    $scope.settings = {};

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading', 'error_on_settings_updating']).then(function (translations) {
        $scope.translations = translations;
    }, null);

    initFields();

    $scope.checkboxClick = function (id)
    {
        if (id == 'chBoxLatestTransaction') $scope.settings.isLatestTransactionWP = !$scope.settings.isLatestTransactionWP;
        if (id == 'chBoxTrends') $scope.settings.isTrendsWP = !$scope.settings.isTrendsWP;
        if (id == 'chBoxBalance') $scope.settings.isBalanceWP = !$scope.settings.isBalanceWP;
        if (id == 'chBoxTransactionLog') $scope.settings.isTransactionLogWP = !$scope.settings.isTransactionLogWP;
        if (id == 'chBoxGoals') $scope.settings.isGoalsWP = !$scope.settings.isGoalsWP;
        if (id == 'chBoxCalendar') $scope.settings.isCalendarWP = !$scope.settings.isCalendarWP;
        if (id == 'chBoxBudget') $scope.settings.isBudgetWP = !$scope.settings.isBudgetWP;
        if (id == 'chBoxCryptobill') $scope.settings.isCryptobillWP = !$scope.settings.isCryptobillWP;

        $scope.updateUserSettings();
    }

    var _settingsLoad = function (lb) {
        settingsService.getUserSettings().then(function (results) {
            $scope.settings = results.data;
            if (lb == null) initControls();
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });
    }

    _settingsLoad(null);

    $scope.updateUserSettings = function () {
        settingsService.updateUserSettings($scope.settings.id, $scope.settings).then(function (response) {

            $rootScope.$broadcast('neadSETTINGSReload', '');

        },
         function (response) {
             if (response.status == 400)
                 $scope.message = $scope.translations.error_on_settings_updating //"Error in process of updating: "
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

    $rootScope.$on('neadSETTINGSReload', function (event, msg) {
        _settingsLoad();
        
    });

    // ....
}]);


