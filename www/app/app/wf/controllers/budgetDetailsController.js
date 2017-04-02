'use strict';
app.controller('budgetDetailsController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', '$modal', 'budgetService', 'settingsService', '$translate', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $modal, budgetService, settingsService, $translate) {

    var startErrorTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
        }, 12000);
    }

    $scope.budgets = [];

    $scope.savedSuccessfully = false;
    $scope.message = "";

    $scope.translations = [];
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
        }
    });

    $translate(['error_on_loading']).then(function (translations) {
    $scope.translations = translations;
}, null);

    budgetService.getBudgetDetails().then(function (results) {
            $scope.budgets = results.data;
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading!";             
            startErrorTimer();
        });

    // ....
}]);


