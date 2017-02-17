'use strict';
app.controller('categoriesController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'categoriesService', 'settingsService', '$translate', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, categoriesService, settingsService, $translate) {

    // Method to Insert
    $scope.createCategory = function () {

        categoriesService.createCategory($scope.category).then(function (response) {

            $scope.savedSuccessfully = true;
            $scope.message = $scope.translations.category_has_been_created; //"Category has been created!";
            startTimer();
            initFields();
        },
         function (response) {
            if (response.status == 400)
                $scope.message = $scope.translations.error_in_process_of_creating //"Error in process of creating: "
                    + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.error_in_process_of_creating //"Error in process of creating: "
                     + errors.join(' ');
            }
            startErrorTimer();
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

    var startErrorTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
        }, 12000);
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
            $scope.message = $scope.translations.category_info_has_been_updated; //"Category info has been updated!";
            startTimer();

        },
         function (response) {
            if (response.status == 400)
                $scope.message = $scope.translations.error_on_category_updating //"Error in process of updating: "
                    + response.data.message;
            else
            {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.error_on_category_updating //"Error on category updating: "
                     + errors.join(' ');
            }
            startErrorTimer();
         });
    };

    $scope.removeCategory = function ()
    {
      categoriesService.deleteCategory($scope.category.id).then(function (response) {
                    $scope.savedSuccessfully = true;
                    $scope.message = $scope.translations.category_has_been_removed; //"Category has been removed!";
                    startTimer();

                }, function (err) {
                    $scope.message = $scope.translations.error_on_category_deleting //"Error on category deleting: "
                    + err;
                    startErrorTimer();
                });
    }

    // initialization and load
    $scope.categories = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading', 'error_in_process_of_creating', 'error_on_category_deleting',
    'category_has_been_removed','error_on_category_updating','category_info_has_been_updated', 'category_has_been_created']).then(function (translations) {
        $scope.translations = translations;
    }, null);

    initFields();

    categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";
            startErrorTimer();
        });


    // ....
}]);