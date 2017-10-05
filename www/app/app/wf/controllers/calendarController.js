'use strict';
app.controller('calendarController', ['$scope', '$rootScope', '$routeParams', '$location', '$timeout', '$route', 'authService', 'calendarService', 'accountsService', 'categoriesService', 'settingsService', 'currenciesService', '$translate', function ($scope, $rootScope, $routeParams, $location, $timeout, $route, $authService, calendarService, accountsService, categoriesService, settingsService, currenciesService, $translate) {

    $scope.settings = {};

    settingsService.getUserSettings().then(function (results) {
        $scope.settings = results.data;

    }, function (error) {

        $scope.settings = {
            id: 'null',
            userId: $authService.authentication.userName,
            isLatestTransactionWP: true,
            isTrendsWP: false,
            isBalanceWP: true,
            isTransactionLogWP: false,
            avatarNumber: 0,
            userLang: 'en',
            subscriptionType: 'WORLD+',
            isGoalsWP: false,
            isCalendarWP: true,
            isBudgetWP: false,
            isCryptobillWP: true
        };
    });

    $scope.calendarEvents = [];

    var initCalendar = function () {
        var myOptions = {
            header: {
                left: null,
                center: 'prev,title,next',
                right: null
            },
            locale:$scope.userLang,
            defaultDate: new Date(),
            selectable: true,
            selectHelper: true,
            select: function select() {
                $('#addNewEvent').modal('show');
            },

            editable: true,
            eventLimit: true,
            windowResize: function windowResize(view) {
                var width = $(window).outerWidth();
                var options = Object.assign({}, myOptions);
                options.events = view.calendar.getEventCache();
                options.aspectRatio = width < 667 ? 0.6 : 1.35;
                //options.aspectRatio = 1;
                $('#calendar').fullCalendar('destroy');
                $('#calendar').fullCalendar(options);
                $('#calendar').fullCalendar('option', 'locale', $scope.userLang);
            },
            eventClick: function eventClick(event) {
                if (event.status != 'DONE') {
                    if (event.transactionCode == 'GOAL')
                        $scope.showModal(event, 'GOAL');
                    else $scope.showModal(event, event.transactionCode);

                    $scope.$apply();
                } else
                {
                    if (event.transactionCode == 'GOAL')
                        $scope.showModal(event, 'GOAL');
                    else $scope.showModal(event, 'DONE');

                    $scope.$apply();
                }
            },
            eventDrop: function eventDragStop(obj, delta, revertFunc) {
                //alert(event.start.format());
                if (obj.status != 'DONE' && obj.transactionCode != 'GOAL') {
                    $scope.calendarEvent = {
                        accountSourceId: obj.accountSourceId,
                        accountDestinationId: obj.accountDestinationId,
                        categoryId: obj.categoryId,
                        currencyCode: obj.currencyCode,
                        transactionValue: obj.transactionValue,
                        transactionCode: obj.transactionCode,
                        repeatEachMonth: obj.repeatEachMonth,
                        start: new Date(new Date(obj.start).setHours(24, 0, 0)),
                        status: obj.status,
                        id: obj.id,
                        userId: obj.userId,
                        statusDate: obj.statusDate,
                        payerName: obj.payerName,
                        accountNumber: obj.accountNumber,
                        payeeNameAndAddress: obj.payeeNameAndAddress
                    };
                    $scope.$apply();

                    $scope.updateEvent();
                } else revertFunc();
            },

            eventDragStart: function eventDragStart() {
                ;
            },
            eventDragStop: function eventDragStop() {
                ;
            },

            events: $scope.calendarEvents,
            droppable: true
        };

        var _options = void 0;
        var myOptionsMobile = Object.assign({}, myOptions);

        myOptionsMobile.aspectRatio = 0.7;
        // myOptions.aspectRatio = 2.35;
        _options = $(window).outerWidth() < 667 ? myOptionsMobile : myOptions;

        $('#calendar').fullCalendar(_options);
    }

    $scope.categories = [];
    $scope.categoriesLookup = {};
    $scope.accountsLookup = {};
    $scope.cryptoAccounts = [];
    $scope.accounts = [];
    $scope.savedSuccessfully = false;
    $scope.message = "";
    $scope.loaded = false;

    $scope.translations = [];
    $scope.userLang = 'en';
    settingsService.getUserLang().then(function (results) {
        if (results.data && results.data.userLang) {
            $translate.use(results.data.userLang);
            $translate.preferredLanguage(results.data.userLang);
            $scope.userLang = results.data.userLang;

            $('#calendar').fullCalendar('option', 'locale', $scope.userLang);
            reTranslate();
        }
    });

    var reTranslate = function () {
        $translate(['error_on_loading', 'calendar_Payment_for', 'calendar_Transfer',
        'error_on_deleting', 'error_in_process_of_creating', 'error_in_process_of_updating']).then(function (translations) {
            $scope.translations = translations;
        }, null);
    }

    reTranslate();

    $scope.currencies = [];
    $scope.currenciesForBill = [];
    $scope.homeCurrency = '';

    var initFields = function (type) {
        $scope.calendarEvent = {
            accountSourceId: '',
            accountDestinationId: '',
            categoryId: 'null',
            currencyCode: $scope.homeCurrency,
            transactionValue: '',
            transactionCode: type,
            repeatEachMonth: false,
            start: new Date((new Date()).setHours(0, 0, 0, 0)),
            status: 'NEW'
        };
    }

    initFields('TRAN');

    var _currenciesLoad = function () {
        currenciesService.getCurrencies().then(function (results) {
            $scope.currencies = results.data;

            $scope.currenciesForBill = [];

            angular.forEach(results.data, function (obj) {
                if (obj.thirdCurencyCode == 'USD' || obj.thirdCurencyCode == 'EUR' || obj.thirdCurencyCode == 'RUB' || obj.thirdCurencyCode == 'UAH') this.push(obj);
            }, $scope.currenciesForBill);

            if ($scope.currencies.length > 0) $scope.homeCurrency = $scope.currencies[0].homeCurrencyCode;
            $scope.calendarEvent.currencyCode = $scope.homeCurrency;
        }, function (error) {
            $scope.message = $scope.translations.transactions_Error_on_loading; //"Error on loading!";
        });
    }

    _currenciesLoad();

    var _categoriesLoad = function () {
        categoriesService.getCategories().then(function (results) {
            $scope.categories = results.data;

            for (var i = 0, len = $scope.categories.length; i < len; i++) {
                $scope.categoriesLookup[$scope.categories[i].id] = $scope.categories[i];
            }

        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of categories!";
        });
    }

    _categoriesLoad();

    var _accountsLoad = function () {
        accountsService.getAccounts().then(function (results) {
            //$scope.accounts = results.data;
            $scope.accounts = [];
            $scope.cryptoAccounts = [];

            angular.forEach(results.data, function (obj) {
                if (obj.accountType == null) this.push(obj);
            }, $scope.accounts);

            angular.forEach(results.data, function (obj) {
                if (obj.accountType == 'BCH') this.push(obj);
            }, $scope.cryptoAccounts);

            for (var i = 0, len = $scope.accounts.length; i < len; i++) {
                $scope.accountsLookup[$scope.accounts[i].id] = $scope.accounts[i];
            }
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of accounts!";
        });
    }

    _accountsLoad();

    var getEvents = function () {
        calendarService.getEvents().then(function (results) {
            //$scope.calendarEvents = results.data;

            if ($scope.settings.isCryptobillWP == false) {
                angular.forEach(results.data, function (obj) {
                    if (obj.transactionCode != 'BILL')
                        this.push(obj);
                }, $scope.calendarEvents);
            } else $scope.calendarEvents = results.data;

            reTranslate();

            for (var i = 0, len = $scope.calendarEvents.length; i < len; i++) {
                var obj = $scope.calendarEvents[i];
                obj.start = obj.start.split('T')[0];

                //if ("undefined" === typeof obj.title) break;

                if (obj.status == 'DONE') {
                //    switch (obj.transactionCode) {
                //        case 'EXP':
                //            obj.title = $scope.translations.calendar_Payment_for + $scope.categoriesLookup[obj.categoryId].title + ': ' + obj.transactionValue + ' ' + obj.currencyCode;
                //            break;
                //        case 'INC':
                //            obj.title = $scope.categoriesLookup[obj.categoryId].title + ': ' + obj.transactionValue + ' ' + obj.currencyCode;
                //            break;
                //        case 'TRAN':
                //            obj.title = $scope.translations.calendar_Transfer + obj.transactionValue + ' ' + obj.currencyCode;
                //            break;
                //        case 'GOAL':
                //            obj.title = 'Savings for ... : ' + obj.transactionValue + ' ' + obj.currencyCode;
                //            break;
                //    }
                    //obj.editable = false;
                    obj.backgroundColor = 'DarkGray';
                    obj.borderColor = 'DarkGray';
                } else {
                    switch (obj.transactionCode) {
                        case 'EXP':
                            //obj.title = $scope.translations.calendar_Payment_for + $scope.categoriesLookup[obj.categoryId].title + ': ' + obj.transactionValue + ' ' + obj.currencyCode;
                            obj.backgroundColor = '#f4b066';
                            obj.borderColor = '#f4b066';
                            break;
                        case 'INC':
                            //obj.title = $scope.categoriesLookup[obj.categoryId].title + ': ' + obj.transactionValue + ' ' + obj.currencyCode;
                            obj.backgroundColor = '#89bceb';
                            obj.borderColor = '#89bceb';
                            break;
                        case 'TRAN':
                            //obj.title = $scope.translations.calendar_Transfer + obj.transactionValue + ' ' + obj.currencyCode;
                            obj.backgroundColor = '#5cd29d';
                            obj.borderColor = '#5cd29d';
                            break;
                        case 'GOAL':
                            //obj.title = 'Savings for ... : ' + obj.transactionValue + ' ' + obj.currencyCode;
                            obj.backgroundColor = '#fa7a7a';
                            obj.borderColor = '#fa7a7a';
                            break;
                        case 'BILL':
                            obj.backgroundColor = '#f96868';
                            obj.borderColor = '#f96868';
                            break;
                    }
                }


            }

            $scope.loaded = true;
            $('#calendar').fullCalendar('removeEvents');
            $('#calendar').fullCalendar('addEventSource', $scope.calendarEvents);         
        }, function (error) {
            $scope.message = $scope.translations.error_on_loading; //"Error on loading of transactions!";
            startErrorTimer();
        });
    }

    initCalendar();
    getEvents();
    
    $scope.saveChanges = function () {
        if ($scope.calendarEvent.id == null)
            $scope.createEvent();
        else $scope.updateEvent();
    }

    $scope.saveBillEvent = function () {
        $scope.calendarEvent.transactionCode = 'BILL';
        if ($scope.calendarEvent.id == null)
            $scope.createEvent();
        else $scope.updateEvent();
    }
    

    $scope.showModal = function (obj, type) {
        if (obj != null) {
            $scope.calendarEvent = {
                accountSourceId: obj.accountSourceId,
                accountDestinationId: obj.accountDestinationId,
                categoryId: obj.categoryId,
                currencyCode: obj.currencyCode,
                transactionValue: obj.transactionValue,
                transactionCode: obj.transactionCode,
                repeatEachMonth: obj.repeatEachMonth,
                start: new Date(new Date(obj.start).setHours(24,0,0)),
                status: obj.status,
                id: obj.id,
                userId: obj.userId,
                statusDate: obj.statusDate,
                payerName:  obj.payerName,
                accountNumber:  obj.accountNumber,
                payeeNameAndAddress:    obj.payeeNameAndAddress
            };

        }
        else initFields(type);

        //$scope.$apply();

        if (type == 'EXP') $('#formExpense').modal();
        if (type == 'INC') $('#formIncome').modal();
        if (type == 'TRAN') $('#formTransfer').modal();
        if (type == 'DONE') $('#lookatEventForm').modal();
        if (type == 'GOAL') $('#formGoal').modal();
        if (type == 'BILL') $('#formBill').modal();
    }

    $scope.showRemoveModal = function (obj) {
        if (obj != null)
            $scope.calendarEvent = obj;

        $scope.$apply();

        $('#formRemove').modal();
    }

    $scope.createEvent = function () {
        calendarService.createEvent($scope.calendarEvent).then(function (response) {
            //$scope.savedSuccessfully = true;
            //$scope.message = $scope.translations.account_has_been_created; //"Account has been created!";
            startTimer();
            initFields();
        },
         function (response) {
             if (response.status == 400)
                 $scope.message = $scope.translations.error_in_process_of_creating //"Error in process of creating: "
                     + response.data.message;
             else {
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
            //$route.reload(); 
            getEvents();
        }, 100);
    }

    var startErrorTimer = function () {
        var timer = $timeout(function () {
            $scope.savedSuccessfully = false;
            $scope.message = "";
            $timeout.cancel(timer);
            if ($authService.authentication.isAuth) {
                reTranslate(); getEvents();
            }
        }, 5000);
    }

    $scope.updateEvent = function () {
        calendarService.updateEvent($scope.calendarEvent.id, $scope.calendarEvent).then(function (response) {
            //$scope.savedSuccessfully = true;
            //$scope.message = "Account info has been updated!";
            startTimer();
        },
         function (response) {
             if (response.status == 400)
                 $scope.message = $scope.translations.error_in_process_of_updating //"Error in process of updating: " 
                     + response.data.message;
             else {
                 var errors = [];
                 for (var key in response.data.modelState) {
                     for (var i = 0; i < response.data.modelState[key].length; i++) {
                         errors.push(response.data.modelState[key][i]);
                     }
                 }
                 $scope.message = $scope.translations.error_in_process_of_updating //"Error on account updating: "
                     + errors.join(' ');
             }
             startErrorTimer();
         });
    };

    $scope.removeEvent = function () {
        calendarService.deleteEvent($scope.calendarEvent.id).then(function (response) {

            startTimer();

        }, function (err) {
            $scope.message = $scope.translations.error_on_deleting //"Error on account deleting: " 
                + err;
            startErrorTimer();
        });
    }

    $rootScope.$on('neadCALENDARReload', function (event, msg) {
        _accountsLoad();
        _categoriesLoad();
        _currenciesLoad();
    });

    //$scope.event = {};

    //var myEvents = [{
    //    title: 'Pay for utilities 240 USD',
    //    start: '2017-03-01',
    //    type: 'EXP',
    //    amount: 240,
    //    backgroundColor: '#f4b066',
    //    borderColor: '#f4b066'
    //},{
    //    title: 'Pay for utilities 240 USD',
    //    start: '2017-02-01',
    //    type: 'DONE',
    //    amount:240,
    //    backgroundColor: 'DarkGray',
    //    borderColor: 'DarkGray'
    //}, {
    //    id: 660,
    //    title: 'Salary 3,420 USD',
    //    start: '2017-03-09',
    //    type: 'INC',
    //    amount: 3420,
    //    backgroundColor: '#89bceb',
    //    borderColor: '#89bceb'
    //}, {
    //    title: 'Transfer 1,250 USD',
    //    start: '2017-03-01',
    //    type: 'TRAN',
    //    amount: 1250,
    //    backgroundColor: '#5cd29d',
    //    borderColor: '#5cd29d'
    //}, {
    //    title: 'Savings for New car should be done 6,250 USD',
    //    start: '2017-03-27',
    //    type: 'GOAL',
    //    amount: 6250,
    //    backgroundColor: '#fa7a7a',
    //    borderColor: '#fa7a7a'
    //}];





    // ....
}]);


