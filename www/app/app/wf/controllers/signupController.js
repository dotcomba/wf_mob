'use strict';
app.controller('signupController', ['$scope', '$location', '$timeout', 'authService', 'settingsService', '$translate', function ($scope, $location, $timeout, authService, settingsService, $translate) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.translations = [];
    //settingsService.getUserLang().then(function (results) {
    //    if (results.data && results.data.userLang) {
    //        $translate.use(results.data.userLang);
    //        $translate.preferredLanguage(results.data.userLang);
    //    }
    //});

    authService.logOut();

    $translate(['signup_user_has_been_registered', 'signup_failed_to_register_user_due_to']).then(function (translations) {
        $scope.translations = translations;
    }, null);

    $scope.registration = {
        userName: "",
        password: "",
        confirmPassword: ""
    };

    $scope.signUp = function () {

        authService.saveRegistration($scope.registration).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.signup_user_has_been_registered; //"User has been registered successfully, you will be redicted to login page in 2 seconds.";
            startTimer();

        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = $scope.translations.signup_failed_to_register_user_due_to //"Failed to register user due to:" 
                 + errors.join(' ');
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 8000);
    }

}]);