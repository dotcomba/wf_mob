'use strict';
app.controller('changePasswordController', ['$scope', '$location', '$timeout', 'authService', function ($scope, $location, $timeout, authService) {

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.changePassword = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    };

    $scope.changePwd = function () {

        authService.changePassword($scope.changePassword).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Your password has been changed successfully, you will be redicted to profile page in 2 seconds.";
            startTimer();

        },
         function (response) {
             var errors = [];
             for (var key in response.data.modelState) {
                 for (var i = 0; i < response.data.modelState[key].length; i++) {
                     errors.push(response.data.modelState[key][i]);
                 }
             }
             $scope.message = "Failed while changing password:" + errors.join(' ');
         });
    };

    var startTimer = function () {
        var timer = $timeout(function () {
            $timeout.cancel(timer);
            $location.path('/profile');
        }, 2000);
    }

}]);