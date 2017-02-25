'use strict'
app.factory('goalsService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var goalsServiceFactory = {};

    // Get all goals for current user
    var _getGoals = function () {

        return $http.get(serviceBase + 'api/goals/goals').then(function (results) {
            return results;
        });
    };
    goalsServiceFactory.getGoals = _getGoals;

    var _getGoalsList = function () {

        return $http.get(serviceBase + 'api/goals/list').then(function (results) {
            return results;
        });
    };
    goalsServiceFactory.getGoalsList = _getGoalsList;

    var _getGoalsTotals = function () {

        return $http.get(serviceBase + 'api/goals/totals').then(function (results) {
            return results;
        });
    };
    goalsServiceFactory.getGoalsTotals = _getGoalsTotals;

    //Create new record
    goalsServiceFactory.createGoal = function (goal) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/goals/insert",
            data: goal
        });
        return result;
    }

    //Update the Record
    goalsServiceFactory.updateGoal = function (id, goal) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/goals/update/" + id,
            data: goal
        });
        return result;
    }

    //Update the State of Goal
    goalsServiceFactory.updateStateGoal = function (id, goal) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/goals/updateState/" + id,
            data: goal
        });
        return result;
    }

    //Delete the Record
    goalsServiceFactory.deleteGoal = function (id) {
        var result = $http({
            method: "delete",
            url: serviceBase + "api/goals/delete/" + id
        });
        return result;
    }

    return goalsServiceFactory;

}]);