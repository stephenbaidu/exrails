angular.module("app").controller("MainController", ['$rootScope', 'APP', '$state', '$stateParams', 'ResMgr',
  function ($rootScope, APP, $state, $stateParams, ResMgr) {
  window.MainController = $rootScope;
  window.ResMgr = ResMgr;
  $rootScope.$state = $state;
  $rootScope.$stateParams = $stateParams;
  $rootScope.modules = APP['modules'] || [];

  $rootScope.hasUrl = function(url) {
    return window.location.hash.indexOf(url) >= 0;
  };

  $rootScope.buildQ = function(data) {
    return _.map(data, function (v, k) {
        return k + '.eq.' + v;
      }).join(':');
  };

  $rootScope.splitQ = function(str) {
    var result = {};
    str.split(':').forEach(function(x){
      var arr = x.split('.eq.');
      arr[1] && (result[arr[0]] = arr[1]);
    });
    return result;
  };

  $rootScope.setCurrentUser = function(currentUser) {
    $rootScope.currentUser = currentUser;
  };

  // Date picker options
  $rootScope.datepicker_opened = {};

  $rootScope.datepicker_clicked = function(e) {
    e.preventDefault();
    e.stopPropagation();
    $rootScope.datepicker_opened[e.target.id] = true
  };

  $rootScope.timepicker_clicked = function(e) {
    e.preventDefault();
    e.stopPropagation();
  };
}]);