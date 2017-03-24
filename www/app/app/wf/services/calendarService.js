'use strict'
app.factory('calendarService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var calendarServiceFactory = {};

    // Get all events for current user
    var _getEvents = function () {

        return $http.get(serviceBase + 'api/events/events').then(function (results) {
            return results;
        });
    };
    calendarServiceFactory.getEvents = _getEvents;

    //get Dashboard Events
    calendarServiceFactory.getDashboardEvents = function () {
        return $http.get(serviceBase + 'api/events/dashboard').then(function (results) {
            return results;
        });
    }

    //Create new record
    calendarServiceFactory.createEvent = function (event) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/events/insert",
            data: event
        });
        return result;
    }

    //Update the Record
    calendarServiceFactory.updateEvent = function (id, event) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/events/update/" + id,
            data: event
        });
        return result;
    }

    //Invoke the Payment
    calendarServiceFactory.invokeEvent = function (id, event, operation) {
        event.operation = operation;
        var result = $http({
            method: "put",
            url: serviceBase + "api/events/invoke/" + id,
            data: event
        });
        return result;
    }

    //Delete the Record
    calendarServiceFactory.deleteEvent = function (id) {
        var result = $http({
            method: "delete",
            url: serviceBase + "api/events/delete/" + id
        });
        return result;
    }

    return calendarServiceFactory;

}]);