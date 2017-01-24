'use strict'
app.factory('categoriesService', ['$http', 'ngAuthSettings', function ($http, ngAuthSettings) {

    var serviceBase = ngAuthSettings.apiServiceBaseUri;

    var categoriesServiceFactory = {};

    var _getCategories = function () {

        return $http.get(serviceBase + 'api/categories').then(function (results) {
            return results;
        });
    };
    categoriesServiceFactory.getCategories = _getCategories;

    //Create new record
    categoriesServiceFactory.createCategory = function (category) {
        var result = $http({
            method: "post",
            url: serviceBase + "api/categories/insert",
            data: category
        });
        return result;
    }

    //Update the Record
    categoriesServiceFactory.updateCategory = function (id, category) {
        var result = $http({
            method: "put",
            url: serviceBase + "api/categories/update/" + id,
            data: category
        });
        return result;
    }

    //Delete the Record
    categoriesServiceFactory.deleteCategory = function (id) {
        var result = $http({
            method: "delete",
            url: serviceBase + "api/categories/delete/" + id
        });
        return result;
    }

    return categoriesServiceFactory;

}]);