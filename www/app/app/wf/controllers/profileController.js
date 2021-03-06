﻿app.controller('profileController', ['$scope', '$routeParams', '$rootScope', '$location', '$timeout', '$route', 'authService', 'settingsService', '$translate', 'paymentsService', function ($scope, $routeParams, $rootScope, $location, $timeout, $route, $authService, settingsService, $translate, paymentsService) {

    $scope.url = "my.welto.io";//$location.host();

    var idParam = $routeParams.id;
    if (idParam != undefined) {
        if (idParam == 'WORLDPLUS')
        {
            var payment = {
                subscription: 'WORLD+',
                paymentCurrency: 'USD',
                paymentAmmount: 12
            };
            paymentsService.createPayment(payment).then(
                function (response) {
                    startTimerSubs();
                },
                 function (response) {
                     if (response.status == 400)
                         $scope.message = $scope.translations.error_in_process_updating_user_settings //"Error in process of updating: "
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

        }
        
    }

    var startTimerSubs = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $rootScope.$broadcast('neadSETTINGSReload', '');
            $location.path('/profile');
        }, 500);
    }

    var startTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $rootScope.$broadcast('neadSETTINGSReload', '');
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
            isCryptobillWP: true
        };
    }

    var initControls = function ()
    {
        if ($scope.settings != null) {
            $scope.curAvatar = $scope.settings.avatarNumber;
        }
    }

    $scope.settings = {};

    $scope.curAvatar = 0;
    $scope.curLang = 'en';
    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
                $translate.use(results.data.userLang);
                $translate.preferredLanguage(results.data.userLang);
                $scope.curLang = results.data.userLang;
            }
    });

    $translate(['error_on_loading', 'error_in_process_updating_user_settings',
'error_on_settings_updating']).then(function (translations) {
    $scope.translations = translations;
}, null);
        
    $scope.savedSuccessfully = false;
    $scope.message = "";

    initFields();

    $scope.avatarClick = function (id)
    {
        $scope.curAvatar = id;
        $scope.settings.avatarNumber = id;

        $scope.updateUserSettings();
    }
	
	$scope.langClick = function (id)
    {
        $scope.curLang = id;
		$translate.use(id);
		$translate.preferredLanguage(id);
		$scope.settings.userLang = id;

        $scope.updateUserSettings();
    }

    settingsService.getUserSettings().then(function (results) {
        $scope.settings = results.data;
        initControls();
    }, function (error) {
        $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
    });

    $scope.payments = [];

    paymentsService.getPayments().then(function (results) {
        $scope.payments = results.data;
    }, function (error) {
        $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
    });

    $scope.referrals = [];

    settingsService.getReferrals().then(function (results) {
        $scope.referrals = results.data;
    }, function (error) {
        $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
    });

    $scope.updateUserSettings = function () {
        settingsService.updateUserSettings($scope.settings.id, $scope.settings).then(function (response) {

            startTimer();

        },
         function (response) {
             if (response.status == 400)
                 $scope.message = $scope.translations.error_in_process_updating_user_settings //"Error in process of updating: "
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

    // ....
}]);


