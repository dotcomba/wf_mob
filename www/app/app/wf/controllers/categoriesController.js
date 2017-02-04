'use strict';
app.controller('categoriesController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'categoriesService', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, categoriesService) {

    // Method to Insert
    $scope.createCategory = function () {

        categoriesService.createCategory($scope.category).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Category has been created!";
            startTimer();
            initFields();
        },
         function (response) {
            if (response.status == 400)
                $scope.message = "Error in process of creating: " + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = "Error in process of creating: " + errors.join(' ');
            }
         });
    };



    var startTimer = function () {
        var timer = $timeout(function () {
        $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            $rootScope.$broadcast('neadTRANReload', '');
            $route.reload();
        }, 500);
    }

    var initFields = function () 
    {
        $scope.category = {
            title: '',
            typeCode: ''
        };
    }

    $scope.showModal = function (obj)
    {
        if (obj != null)
        $scope.category = obj;
        else initFields();

        $('#editCategoryForm').modal();
    }

    $scope.saveChanges = function ()
    {
        if ($scope.category.id == null)
            $scope.createCategory();
         else $scope.updateCategory();
    }

    $scope.showRemoveModal = function (obj)
    {
        if (obj != null)
            $scope.category = obj;

        $('#removeCategoryForm').modal();
    }

    $scope.updateCategory = function ()
    {
        categoriesService.updateCategory($scope.category.id, $scope.category).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = "Category info has been updated!";
            startTimer();

        },
         function (response) {
            if (response.status == 400)
                $scope.message = "Error in process of updating: " + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = "Error on category updating: " + errors.join(' ');
            }
         });
    };

    $scope.removeCategory = function ()
    {
      categoriesService.deleteCategory($scope.category.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = "Category has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = "Error on category deleting: " + err;
                });
    }

    // initialization and load
    $scope.categories = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";

    initFields();

    categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;
        }, function (error) {
            $scope.message = "Error on loading!";
        });


    // ....
}]);