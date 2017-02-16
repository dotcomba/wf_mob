'use strict';
app.controller('forgotPasswordController', ['$scope', '$location', '$timeout', 'authService', 'settingsService', '$translate', function ($scope, $location, $timeout, authService, settingsService, $translate) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.forgotPassword = {
        email: ''
    };

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['you_will_obtain_email_message', 'user_with_this_e_mail_unregistered']).then(function (translations) {
        $scope.translations = translations;
    }, null);

    $scope.forgotPwd = function () {

        authService.forgotPassword($scope.forgotPassword).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.forgotPassword.email = '';
            $scope.message = $scope.translations.you_will_obtain_email_message; //"Your will obtain email message with further instructions ASAP";
            startTimer();

        },
         function (response) {
             $scope.message = $scope.translations.user_with_this_e_mail_unregistered; //"User with this e-mail unregistered in system";
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 5000);
    }

}]);