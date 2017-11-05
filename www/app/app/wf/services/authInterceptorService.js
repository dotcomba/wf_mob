'use strict';
app.factory('authInterceptorService', ['$q', '$injector', '$location', 'localStorageService', '$routeParams', function ($q, $injector, $location, localStorageService, $routeParams) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        config.headers = config.headers || {};
       
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    }

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('authService');
            var authData = localStorageService.get('authorizationData');

            if (authData) {
                if (authData.useRefreshTokens) {
                    $location.path('/refresh');
                    return $q.reject(rejection);
                }
            }
            authService.logOut();
            //if (getParameterByName('register') == null) {
            if ($routeParams.regWeb == undefined && $routeParams.tour == undefined) {
                if (window.innerWidth < 700)
                    window.location = 'tour/tour.html';
                else window.location = 'tour_w/tour.html'; //$location.path('/login');
            }
            //}
        }
        return $q.reject(rejection);
    }

    function getParameterByName(name) {
        var regexS = "[\\?&]" + name + "=([^&#]*)",
      regex = new RegExp(regexS),
      results = regex.exec(window.location.search);
        if (results == null) {
            return "";
        } else {
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        }
    }

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);