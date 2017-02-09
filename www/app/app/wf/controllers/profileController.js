app.controller('profileController', ['$scope', '$routeParams', '$rootScope', '$location', '$timeout', '$route', 'authService', 'settingsService', function ($scope, $routeParams, $rootScope, $location, $timeout, $route, $authService, settingsService) {

    var startTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $rootScope.$broadcast('neadSETTINGSReload', '');
            $route.reload();
        }, 500);
    }

    var initFields = function () {
        $scope.settings = {
            id: 'null',
            userId: $authService.authentication.userName,
            isLatestTransactionWP : true,
            isTrendsWP : true,
            isBalanceWP : true,
            isTransactionLogWP: true,
            avatarNumber: 0
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

    $scope.savedSuccessfully = false;
    $scope.message = "";

    initFields();

    $scope.avatarClick = function (id)
    {
        $scope.curAvatar = id;
        $scope.settings.avatarNumber = id;

        $scope.updateUserSettings();
    }

    settingsService.getUserSettings().then(function (results) {
        $scope.settings = results.data;
        initControls();
    }, function (error) {
        $scope.message = "Error on loading!";
    });

    $scope.updateUserSettings = function () {
        settingsService.updateUserSettings($scope.settings.id, $scope.settings).then(function (response) {

            startTimer();

        },
         function (response) {
             if (response.status == 400)
                 $scope.message = "Error in process of updating: " + response.data.message;
             else {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = "Error on settings updating: " + errors.join(' ');
             }
         });
    };

    // ....
}]);


