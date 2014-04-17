angular.module("app").controller("MainController", ['$rootScope', 'APP', '$state', '$stateParams', 'ResMgr',
  function ($rootScope, APP, $state, $stateParams, ResMgr) {
  window.MainController = $rootScope;
  window.ResMgr = ResMgr;
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.modules = APP['modules'] || [];

  $rootScope.hasUrl = function(url) {
    return window.location.hash.indexOf(url) == 0;
  }
}]);