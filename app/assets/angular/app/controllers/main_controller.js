angular.module("app").controller("MainController", ['$rootScope', 'APP', '$state', '$stateParams',
  function ($rootScope, APP, $state, $stateParams) {
  window.MainController = $rootScope;
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.modules = APP['modules'] || [];

  $rootScope.hasUrl = function(url) {
    return window.location.hash.indexOf(url) == 0;
  }
}]);