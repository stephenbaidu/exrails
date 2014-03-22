angular.module("app").controller("MainController", ['$rootScope', 'APP', '$state', '$stateParams', 'ResMgr',
  function ($rootScope, APP, $state, $stateParams, ResMgr) {
  window.MainController = $rootScope;
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  window.ResMgr = ResMgr;

  $rootScope.hasUrl = function(url) {
    return window.location.hash.indexOf(url) == 0;
  }

  // Lookup Configuration
  $rootScope.lookups = [
    "roles"
  ];

  angular.forEach($rootScope.lookups, function (url) {
    ResMgr.register(url, APP.apiPrefix + url + '/:id', null, { type: "l" });
  });

  $rootScope.modules = {
    admin: { text: "Admin Center", url: "admin", dropdown: true, 
      links: [
        { text: "Users", url: "users", icon: "fa fa-users" },
        { text: "Roles", url: "roles", icon: "fa fa-sort-numeric-asc" }
      ]
    }
  }
  
}]);
