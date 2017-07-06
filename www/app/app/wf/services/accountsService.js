'use strict'
app.factory('accountsService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var accountsServiceFactory = {};

    // Get all accounts for current user
    var _getAccounts = function () {

        return $http.get(serviceBase + 'api/accounts').then(function (results) {
            return results;
        });
    };
    accountsServiceFactory.getAccounts = _getAccounts;

    var _getAccountsHome = function () {

        return $http.get(serviceBase + 'api/accounts/home').then(function (results) {
            return results;
        });
    };
    accountsServiceFactory.getAccountsHome = _getAccountsHome;

    //Create new record
    accountsServiceFactory.createAccount = function (account) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/accounts/insert",
            data: account
        });
        return result;
    }

    //Update the Record
    accountsServiceFactory.updateAccount = function (id, account) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/accounts/update/" + id,
            data: account
        });
        return result;
    }   

    //Delete the Record
    accountsServiceFactory.deleteAccount = function (id) {
        var result = $http({
            method: "delete",
            url: serviceBase + "api/accounts/delete/" + id
        });
        return result;
    }

    return accountsServiceFactory;

}]);