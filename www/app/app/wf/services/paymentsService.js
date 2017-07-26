'use strict'
app.factory('paymentsService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var paymentsServiceFactory = {};

    var _getPayments = function () {

        return $http.get(serviceBase + 'api/payments').then(function (results) {
            return results;
        });
    };
    paymentsServiceFactory.getPayments = _getPayments;

    //Create new record
    paymentsServiceFactory.createPayment = function (payment) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/payments/insert",
            data: payment
        });
        return result;
    }

    return paymentsServiceFactory;
}]);