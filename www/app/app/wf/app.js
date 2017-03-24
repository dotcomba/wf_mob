
var app = angular.module('WFApp', ['pascalprecht.translate', 'ngRoute', 'LocalStorageModule', 'angular-loading-bar', 'ui.bootstrap', 'chart.js']);

app.config(function ($routeProvider) {

    $routeProvider.when("/allstuf", {
        controller: "allstufController",
        templateUrl: "app/wf/views/allstuf.html"
    });

    $routeProvider.when("/calendar", {
        controller: "calendarController",
        templateUrl: "app/wf/views/calendar.html"
    });

    $routeProvider.when("/expensises", {
        controller: "allstufController",
        templateUrl: "app/wf/views/expensises.html"
    });

    $routeProvider.when("/incomes", {
        controller: "allstufController",
        templateUrl: "app/wf/views/incomes.html"
    });

    $routeProvider.when("/login", {
        controller: "loginController",
        templateUrl: "app/wf/views/login.html"
    });

    $routeProvider.when("/forgot", {
        controller: "forgotPasswordController",
        templateUrl: "app/wf/views/forgot-password.html"
    });

    $routeProvider.when("/signup", {
        controller: "signupController",
        templateUrl: "app/wf/views/signup.html"
    });

    $routeProvider.when("/changePassword", {
        controller: "changePasswordController",
        templateUrl: "app/wf/views/change-password.html"
    });

    $routeProvider.when("/resetPassword", {
        controller: "resetPasswordController",
        templateUrl: "app/wf/views/reset-password.html"
    });

    $routeProvider.when("/refresh", {
        controller: "refreshController",
        templateUrl: "app/wf/views/refresh.html"
    });

    $routeProvider.when("/tokens", {
        controller: "tokensManagerController",
        templateUrl: "app/wf/views/tokens.html"
    });

    $routeProvider.when("/associate", {
        controller: "associateController",
        templateUrl: "app/wf/views/associate.html"
    });

    $routeProvider.when("/categories", {
        controller: "categoriesController",
        templateUrl: "app/wf/views/categories.html"
    });

    $routeProvider.when("/dashboard", {
        controller: "dashboardController",
        templateUrl: "app/wf/views/dashboard.html"
    });

    $routeProvider.when("/transactions", {
        controller: "transactionsController",
        templateUrl: "app/wf/views/transactions.html"
    });

    $routeProvider.when("/accounts", {
        controller: "accountsController",
        templateUrl: "app/wf/views/accounts.html"
    });

    $routeProvider.when("/settings", {
        controller: "settingsController",
        templateUrl: "app/wf/views/settings.html"
    });

    $routeProvider.when("/profile", {
        controller: "profileController",
        templateUrl: "app/wf/views/profile.html"
    });

    $routeProvider.when("/currencies", {
        controller: "currenciesController",
        templateUrl: "app/wf/views/currencies.html"
    });

    $routeProvider.when("/reportIncomes", {
        controller: "reportIncomesController",
        templateUrl: "app/wf/views/reportIncomes.html"
    });

    $routeProvider.when("/reportExpensises", {
        controller: "reportExpensisesController",
        templateUrl: "app/wf/views/reportExpensises.html"
    });

    $routeProvider.when("/reportTrends", {
        controller: "reportTrendsController",
        templateUrl: "app/wf/views/reportTrends.html"
    });

    $routeProvider.when("/goals", {
        controller: "goalsController",
        templateUrl: "app/wf/views/goals.html"
    });

    $routeProvider.when("/wizard", {
        controller: "wizardController",
        templateUrl: "app/wf/views/wizard.html"
    });

    $routeProvider.when("/wizard/page/:id", {
        controller: "wizardController",
        templateUrl: "app/wf/views/wizard.html"
    });

    $routeProvider.otherwise({ redirectTo: "/dashboard" });

});

//var serviceBase = 'http://localhost:49213/';
var serviceBase = 'https://server-wealthflow.azurewebsites.net/';
var alxUri = 'https://pitangui.amazon.com/spa/skill/account-linking-status.html?vendorId=M301DP3LUKK6ND#state=';

//var serviceBase = 'http://dev-m5.cloudapp.net/';

app.constant('ngAuthSettings', {
    apiServiceBaseUri: serviceBase,
    apiAlxUri: alxUri,
    clientId: 'ngAuthApp'
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push('authInterceptorService');
});

app.config(function ($translateProvider) {
    $translateProvider

            .useStaticFilesLoader({
                prefix: 'app\\scripts\\translator\\langs\\',
                suffix: '.json'
            })
            .preferredLanguage('en')
            .useSanitizeValueStrategy('escape');
});

app.run(['authService', function (authService) {
    authService.fillAuthData();
}]);


