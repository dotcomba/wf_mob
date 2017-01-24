(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define('/App/Contacts', ['exports', 'BaseApp'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('BaseApp'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.BaseApp);
    global.AppContacts = mod.exports;
  }
})(this, function (exports, _BaseApp2) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.getInstance = exports.run = exports.AppContacts = undefined;

  var _BaseApp3 = babelHelpers.interopRequireDefault(_BaseApp2);

  var AppContacts = function (_BaseApp) {
    babelHelpers.inherits(AppContacts, _BaseApp);

    function AppContacts() {
      babelHelpers.classCallCheck(this, AppContacts);
      return babelHelpers.possibleConstructorReturn(this, (AppContacts.__proto__ || Object.getPrototypeOf(AppContacts)).apply(this, arguments));
    }

  
    return AppContacts;
  }(_BaseApp3.default);

  var instance = null;

  function getInstance() {
    if (!instance) {
      instance = new AppContacts();
    }

    return instance;
  }

  function run() {
    var app = getInstance();
    app.run();
  }

  exports.default = AppContacts;
  exports.AppContacts = AppContacts;
  exports.run = run;
  exports.getInstance = getInstance;
});
