'use strict';
app.controller('forgotPasswordController', ['$scope', '$location', '$timeout', 'authService', function ($scope, $location, $timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.forgotPassword = {
        email: ''
    };

    $scope.forgotPwd = function () {

        authService.forgotPassword($scope.forgotPassword).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.forgotPassword.email = '';
            $scope.message = "Your will obtain email message with further instructions ASAP";
            startTimer();

        },
         function (response) {
             $scope.message = "User with this e-mail unregistered in system";
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/login');
        }, 5000);
    }

}]);