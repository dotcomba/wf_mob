(function(Config) {
  "use strict";
  Config.set('tour', {
    steps: [{
        element: "#actionBtn",
        position: 'left',
        intro: "Welcome <p class='content'>Use this button to add new incomes, expenses or transfer funds from one account to another</p>"
    },
    {
    intro: "Dashboard <p class='content'>Here, you will see your current balance, trends, incomes, expenses, latest transactions.<br/> This is your personal dashboard.</p>"
    },
    {
    element: "#toggleMenubar2",
    position: 'right',
    intro: "Menu <p class='content'>Use it when you want set up your currencies, categories, accounts or see reports and trends</p>"
    }
    ],
    skipLabel: "<i class='wb-close'></i>",
    doneLabel: "<i class='wb-close'></i>",
    nextLabel: "Next <i class='wb-chevron-right-mini'></i>",
    prevLabel: "<i class='wb-chevron-left-mini'></i>Prev",
    showBullets: false
  });

})(Config);
