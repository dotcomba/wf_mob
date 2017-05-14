'use strict'
app.factory('budgetService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var budgetServiceFactory = {};

    // Get all budgets for current user
    var _getBudgets = function () {

        return $http.get(serviceBase + 'api/budget/budgetlist').then(function (results) {
            return results;
        });
    };
    budgetServiceFactory.getBudgets = _getBudgets;

    // Get budget for Dashboard
    var _getBudgetDashboard = function () {

        return $http.get(serviceBase + 'api/budget/budgetdashboard').then(function (results) {
            return results;
        });
    };
    budgetServiceFactory.getBudgetDashboard = _getBudgetDashboard;

    // Get budget Details
    var _getBudgetDetails = function () {

        return $http.get(serviceBase + 'api/budget/budgetdetails').then(function (results) {
            return results;
        });
    };
    budgetServiceFactory.getBudgetDetails = _getBudgetDetails;

    //Create new record
    budgetServiceFactory.createBudget = function (budget) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/budget/insert",
            data: budget
        });
        return result;
    }

    //Update the Record
    budgetServiceFactory.updateBudget = function (id, budget) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/budget/update/" + id,
            data: budget
        });
        return result;
    }

    //Delete the Record
    budgetServiceFactory.deleteBudget = function (id) {
        var result = $http({
            method: "delete",
            url: serviceBase + "api/budget/delete/" + id
        });
        return result;
    }

    return budgetServiceFactory;

}]);