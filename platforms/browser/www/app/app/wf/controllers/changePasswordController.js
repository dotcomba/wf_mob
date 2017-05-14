'use strict';
app.controller('changePasswordController', ['$scope', '$location', '$timeout', 'authService', 'settingsService', '$translate', function ($scope, $location, $timeout, authService, settingsService, $translate) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.changePassword = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['failed_while_changing_password', 'your_password_has_been_changed']).then(function (translations) {
        $scope.translations = translations;
    }, null);

    $scope.changePwd = function () {

        authService.changePassword($scope.changePassword).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.your_password_has_been_changed; //"Your password has been changed successfully, you will be redicted to profile page in 2 seconds.";
            startTimer();

        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = $scope.translations.failed_while_changing_password //"Failed while changing password:"
                 + errors.join(' ');
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/profile');
        }, 2000);
    }

}]);