'use strict'
app.factory('currenciesService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var currenciesServiceFactory = {};

    var _getCurrencies = function () {

        return $http.get(serviceBase + 'api/currencies').then(function (results) {
            return results;
        });
    };
    currenciesServiceFactory.getCurrencies = _getCurrencies;

    var _getCurrencyList = function () {

        return $http.get(serviceBase + 'api/currencies/list').then(function (results) {
            return results;
        });
    };
    currenciesServiceFactory.getCurrencyList = _getCurrencyList;

    //Create new record
    currenciesServiceFactory.createCurrency = function (currency) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/currencies/insert",
            data: currency
        });
        return result;
    }

    //Update the Record
    currenciesServiceFactory.updateCurrency = function (id, currency) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/currencies/update/" + id,
            data: currency
        });
        return result;
    }

    //Delete the Record
    currenciesServiceFactory.deleteCurrency = function (id) {
        var result = $http({
            method: "delete",
            url: serviceBase + "api/currencies/delete/" + id
        });
        return result;
    }

    return currenciesServiceFactory;

}]);