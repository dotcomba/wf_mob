'use strict';
app.controller('resetPasswordController', ['$scope', '$location', '$routeParams', '$timeout', 'authService', function ($scope, $location, $routeParams, $timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.resetPassword = {
        email: '',
        code: getParameterByName('resetCode'),
        newPassword: '',
        confirmPassword: ''
    };

    $scope.resetPwd = function () {

        authService.resetPassword($scope.resetPassword).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Your password has been changed successfully, you will be redirected to login page in 3 seconds.";
            startTimer();

        },
         function (response) {
             if (response.status == 400)
                 $scope.message = "Failed while changing password: " + response.data.message;
             else {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = "Failed while changing password: " + errors.join(' ');
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