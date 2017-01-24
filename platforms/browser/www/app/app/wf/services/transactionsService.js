'use strict'
app.factory('transactionsService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var transactionsServiceFactory = {};

    // Get all categories
    var _getTransactions = function () {

        return $http.get(serviceBase + 'api/transactions').then(function (results) {
            return results;
        });
    };
    transactionsServiceFactory.getTransactions = _getTransactions;

    var _getAllTransactions = function () {

        return $http.get(serviceBase + 'api/transactions/allstuf').then(function (results) {
            return results;
        });
    };
    transactionsServiceFactory.getAllTransactions = _getAllTransactions;

    //Create new record
    transactionsServiceFactory.createTransaction = function (transaction) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/transactions/insert",
            data: transaction
        });
        return result;
    }

    // Get all transaction for Income and Expensises Reports
    var _getReportIncomeTransactions = function () {

        return $http.get(serviceBase + 'api/transactions/currentReportINC').then(function (results) {
            return results;
        });
    };
    transactionsServiceFactory.getReportIncomeTransactions = _getReportIncomeTransactions;

    var _getReportExpensisesTransactions = function () {

        return $http.get(serviceBase + 'api/transactions/currentReportEXP').then(function (results) {
            return results;
        });
    };
    transactionsServiceFactory.getReportExpensisesTransactions = _getReportExpensisesTransactions;

    return transactionsServiceFactory;

}]);