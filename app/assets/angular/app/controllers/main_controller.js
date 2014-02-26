angular.module("app").controller("MainController", ['$rootScope', '$state', '$stateParams', 'ResMgr',
  function ($rootScope, $state, $stateParams, ResMgr) {
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
    ResMgr.register(url, '/api/' + url + '/:id', null, { type: "l" });
  });
  
}]);
