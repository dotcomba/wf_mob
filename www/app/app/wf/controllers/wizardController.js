'use strict';
app.controller('wizardController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', 'authService', 'transactionsService', 'ngAuthSettings', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $authService, transactionsService, ngAuthSettings) {

    $scope.wzs = [];

    $authService.authentication.isSetup = false;

    var idParam = $routeParams.id;
    if (idParam != undefined) {
        for (var i = 1, len = idParam; i <= len; i++) 
        {
            if (i == idParam)     
            {       
                $("#wz" + i).addClass('current');
                $("#wp" + i).addClass('active');
            }
            else $("#wz" + i).addClass('done')
        }

        if (idParam != 3)
            $("#btnBack").removeClass('disabled');
        if (idParam == 4)
        {
            $("#btnNext").addClass('hidden-xs-up');
            $("#btnFinish").removeClass('hidden-xs-up');
        }
    }

    $scope.btnNext = function () {
        $location.path('/wizard/page/' + (parseInt(idParam,10) + 1).toString());
    };

    $scope.btnBack = function () {
        $location.path('/wizard/page/' + (parseInt(idParam,10) - 1).toString());
    };

    $scope.btnFinish = function () {
        $rootScope.$broadcast('neadTRANReload', '');
        $rootScope.$broadcast('neadBILLReload', '');
        $rootScope.$broadcast('neadCALENDARReload', '');
        $rootScope.$broadcast('neadSETTINGSReload', '');
        
        $location.path('/dashboard'); 
        //window.location = '/index.html';

        $authService.authentication.isSetup = true;
    };

}]);