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

    //
    var _getReportPeriodsIncome = function () {

        return $http.get(serviceBase + 'api/transactions/getReportPeriodsINC').then(function (results) {
            return results;
        });
    };
    transactionsServiceFactory.getReportPeriodsIncome = _getReportPeriodsIncome;

    var _getReportPeriodsExpense = function () {

        return $http.get(serviceBase + 'api/transactions/getReportPeriodsEXP').then(function (results) {
            return results;
        });
    };
    transactionsServiceFactory.getReportPeriodsExpense = _getReportPeriodsExpense;

    var _getReportExpensesByPeriod = function (id) {

        return $http.get(serviceBase + 'api/transactions/getReportExpensesByPeriod/' + id).then(function (results) {
            return results;
        });
    };
    transactionsServiceFactory.getReportExpensesByPeriod = _getReportExpensesByPeriod;

    var _getReportIncomesByPeriod = function (id) {

        return $http.get(serviceBase + 'api/transactions/getReportIncomesByPeriod/' + id).then(function (results) {
            return results;
        });
    };
    transactionsServiceFactory.getReportIncomesByPeriod = _getReportIncomesByPeriod;

    //Update the Record
    transactionsServiceFactory.cancelTransaction = function (id, transaction) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/transactions/cancel/" + id,
            data: transaction
        });
        return result;
    }

    return transactionsServiceFactory;

}]);