'use strict'
app.factory('settingsService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var settingsServiceFactory = {};

    var _getUserSettings = function () {

        return $http.get(serviceBase + 'api/settings').then(function (results) {
            return results;
        });
    };
    settingsServiceFactory.getUserSettings = _getUserSettings;

    //Update the Record
    settingsServiceFactory.updateUserSettings = function (id, settings) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/settings/update/" + id,
            data: settings
        });
        return result;
    }

    settingsServiceFactory.getUserLang = function () {
        return $http.get(serviceBase + 'api/settings').then(function (results) {
            return results;
        });
    };

    settingsServiceFactory.getReferrals = function () {
        return $http.get(serviceBase + 'api/settings/refs').then(function (results) {
            return results;
        });
    };

    return settingsServiceFactory;

}]);