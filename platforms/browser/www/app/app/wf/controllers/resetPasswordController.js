'use strict';
app.controller('resetPasswordController', ['$scope', '$location', '$routeParams', '$timeout', 'authService', 'settingsService', '$translate', function ($scope, $location, $routeParams, $timeout, authService, settingsService, $translate) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.translations = [];
    //settingsService.getUserLang().then(function (results) {
    //    if (results.data && results.data.userLang) {
    //        $translate.use(results.data.userLang);
    //        $translate.preferredLanguage(results.data.userLang);
    //    }
    //});

    $translate(['reset_your_password_has_been_changed', 'reset_failed_while_changing_password']).then(function (translations) {
        $scope.translations = translations;
    }, null);

    $scope.resetPassword = {
        email: '',
        code: getParameterByName('resetCode'),
        newPassword: '',
        confirmPassword: ''
    };

    $scope.resetPwd = function () {

        authService.resetPassword($scope.resetPassword).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.reset_your_password_has_been_changed; //"Your password has been changed successfully, you will be redirected to login page in 3 seconds.";
            startTimer();

        },
         function (response) {
             if (response.status == 400)
                 $scope.message = $scope.translations.reset_failed_while_changing_password //"Failed while changing password: " 
                     + response.data.message;
             else {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.reset_failed_while_changing_password //"Failed while changing password: "
                     + errors.join(' ');
             }

         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            //$location.path('/login');
            window.location = "index.html#/login";
        }, 3000);
    }

    function getParameterByName(name) {
        var regexS = "[\\?&]" + name + "=([^&#]*)",
      regex = new RegExp(regexS),
      results = regex.exec(window.location.search);
        if (results == null) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }

}]);