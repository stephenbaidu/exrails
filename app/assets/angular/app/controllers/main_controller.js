angular.module("app").controller("MainController", ['$rootScope', 'APP', '$state', '$stateParams', 'ResMgr',
  function ($rootScope, APP, $state, $stateParams, ResMgr) {
  window.MainController = $rootScope;
  window.ResMgr = ResMgr;
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.modules = APP['modules'] || [];

  $rootScope.hasUrl = function(url) {
    return window.location.hash.indexOf(url) >= 0;
  }

  $rootScope.setCurrentUser = function(currentUser) {
    $rootScope.currentUser = currentUser;
  }

  // Date picker options
  $rootScope.datepicker_opened = {}

  $rootScope.datepicker_clicked = function(e) {
    e.preventDefault();
    e.stopPropagation();
    $rootScope.datepicker_opened[e.target.id] = true
  }

  $rootScope.timepicker_clicked = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };
}]);