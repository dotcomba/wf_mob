'use strict';
app.controller('invoiceController', ['$scope', '$routeParams', '$location', 'billsService', '$timeout', '$route', function ($scope, $routeParams, $location, billsService, $timeout, $route) {

    $scope.invoice = null;

    var startErrorTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $route.reload();
        }, 12000);
    }

    var resParam = $routeParams.billId;
    if (resParam != undefined) {
        billsService.getInvoice(resParam).then(function (result) {
            if (result.data.status == 'PROCESSING') $scope.invoice = result.data;
            else { $scope.message = "This bill has been already paid or expired!"; }
        }, function (error) {
            $scope.message = "Error on loading ";
            startErrorTimer();
        });
    }
    else $scope.invoice = null;

    $scope.go = function ()
    {
        $location.path('/bills/callback/return');
    }

    $scope.savedSuccessfully = false;
    $scope.message = "";

}]);


