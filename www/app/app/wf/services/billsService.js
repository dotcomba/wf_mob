'use strict'
app.factory('billsService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var billsServiceFactory = {};

    // Get all bills for current user
    var _getBills = function () {

        return $http.get(serviceBase + 'api/bills').then(function (results) {
            return results;
        });
    };
    billsServiceFactory.getBills = _getBills;

    var _getBillsTotals = function () {

        return $http.get(serviceBase + 'api/bills/totals').then(function (results) {
            return results;
        });
    };
    billsServiceFactory.getBillsTotals = _getBillsTotals;

    //Create new record
    billsServiceFactory.createBill = function (bill) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/bills/insert",
            data: bill
        });
        return result;
    }

    //Update the Record
    billsServiceFactory.updateBill = function (id, bill) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/bills/update/" + id,
            data: bill
        });
        return result;
    }   

    //Delete the Record
    billsServiceFactory.deleteBill = function (id) {
        var result = $http({
            method: "delete",
            url: serviceBase + "api/bills/delete/" + id
        });
        return result;
    }

    return billsServiceFactory;

}]);