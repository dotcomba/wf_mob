app.controller('settingsController', ['$scope', '$routeParams', '$rootScope', '$location', '$timeout', '$route', 'authService', 'settingsService', function ($scope, $routeParams, $rootScope, $location, $timeout, $route, $authService, settingsService) {

    var startTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $route.reload();
        }, 2000);
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
        if ($scope.settings.isLatestTransactionWP)
            $("#chBoxLatestTransaction").attr('checked', '');
        if ($scope.settings.isTrendsWP)
            $("#chBoxTrends").attr('checked', '');
        if ($scope.settings.isBalanceWP)
            $("#chBoxBalance").attr('checked', '');
        if ($scope.settings.isTransactionLogWP)
            $("#chBoxTransactionLog").attr('checked', '');
        //$("#btnFinish").removeAttr('checked');
    }

    $scope.settings = {};

    $scope.savedSuccessfully = false;
    $scope.message = "";

    initFields();

    $scope.checkboxClick = function (id)
    {
        if (id == 'chBoxLatestTransaction') $scope.settings.isLatestTransactionWP = !$scope.settings.isLatestTransactionWP;
        if (id == 'chBoxTrends') $scope.settings.isTrendsWP = !$scope.settings.isTrendsWP;
        if (id == 'chBoxBalance') $scope.settings.isBalanceWP = !$scope.settings.isBalanceWP;
        if (id == 'chBoxTransactionLog') $scope.settings.isTransactionLogWP = !$scope.settings.isTransactionLogWP;

        $scope.updateUserSettings();
    }

    var _settingsLoad = function (lb) {
        settingsService.getUserSettings().then(function (results) {
            $scope.settings = results.data;
            if (lb == null) initControls();
        }, function (error) {
            $scope.message = "Error on loading!";
        });
    }

    _settingsLoad(null);

    $scope.updateUserSettings = function () {
        settingsService.updateUserSettings($scope.settings.id, $scope.settings).then(function (response) {

            ;

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

    $rootScope.$on('neadSETTINGSReload', function (event, msg) {
        _settingsLoad();
        
    });

    // ....
}]);


