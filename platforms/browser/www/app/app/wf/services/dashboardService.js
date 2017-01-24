'use strict';
app.factory('dashboardService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var dashboardServiceFactory = {};

    var _getDashboard = function () {

        return $http.get(serviceBase + 'api/dashboard').then(function (results) {
            return results;
        });
    };

    dashboardServiceFactory.getDashboard = _getDashboard;

    var _getTrends = function () {

        return $http.get(serviceBase + 'api/dashboard/trends').then(function (results) {
            return results;
        });
    };

    dashboardServiceFactory.getTrends = _getTrends;

    return dashboardServiceFactory;

}]);