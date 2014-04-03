var app = angular.module("app");

app.controller("AppController", ['$scope', 'APP', '$rootScope', 'ResMgr', '$state', '$stateParams',
  function ($scope, APP, $rootScope, ResMgr, $state, $stateParams) {
  window.AppController = $scope;

  // Global configurations
  $.pnotify.defaults.styling = "bootstrap3";
  $.pnotify.defaults.history = false;
  $.pnotify.defaults.delay = 2000;
}]);

app.controller("AppIndexController", ['$scope', 'APP', '$q', 'ResMgr', 'ExMsgBox', '$state', '$stateParams', '$http',
  function ($scope, APP, $q, ResMgr, ExMsgBox, $state, $stateParams, $http) {
  window.AppIndexController = $scope;
  $scope.records = [];
  $scope.totalRecords = 0;
  $scope.recordsPerPage = 15;
  $scope.queryString = '';
  $scope.currentPage = 1;
  $scope.pageSizes = [5, 10, 15, 20, 25, 30, 50, 100, 500, 1000];
  $scope.model = ResMgr.register($stateParams.url, APP.apiPrefix + $stateParams.url.replace('-', '_') + '/:id');

  $scope.queryRecords = function (page, size, query) {
    page = page || 1;
    size = size || $scope.recordsPerPage;
    if(query || query == '') {
      $scope.queryString = query;
    }
    query = query || '';
    ResMgr.query($scope.model.name, { page: page, size: size, query: $scope.queryString })
      .then(function (res) {
        $scope.totalRecords = res.data.total;
        $scope.records = res.data.rows;
      })
      .catch(function (res) {
        angular.forEach(res.error.messages, function(msg) {
          ExMsgBox.error(msg);
        });
      });
  };

  $scope.$watch('recordsPerPage', function() {
    $scope.queryRecords();
  });

  $scope.delete = function (id) {
    var msg = "Are you sure you want to Delete this " + $scope.model.display + "?";
    ExMsgBox.confirm(msg, "Confirm Delete").then(function () {
      var data = { id: id };
      data[$scope.model.key] = $scope.record;
      ResMgr.delete($scope.model.name, data)
        .then(function (res) {
          $scope.queryRecords();
          ExMsgBox.success($scope.model.name + " deleted successfully");
        })
        .catch(function (res) {
          angular.forEach(res.error.messages, function(msg) {
            ExMsgBox.error(msg);
          });
        });
    });
  };

  $http.get(APP.tplPrefix + $scope.model.url + '/config')
    .success(function(res) {
      if(res.success) {
        $scope.columns = _.clone(res.data.columns);
        $scope.options = _.clone(res.data.options);
        _.each(res.data.options, function(v, k) {
          $scope['options_' + k] = _.clone(v);
        });
      }
    })
    .error(function(data, status, headers, config) {
      ExMsgBox.error('Error');
    });
}]);


app.controller("AppSearchController", ['$scope', 'APP', 'ResMgr', 'ExMsgBox', '$state', '$stateParams', '$http',
  function ($scope, APP, ResMgr, ExMsgBox, $state, $stateParams, $http) {
  window.AppSearchController = $scope;
  $scope.query = '';

  $http.get(APP.tplPrefix + $scope.model.url + '/config')
    .success(function(res) {
      if(res.success) {
        $scope.lookups = _.clone(res.data.lookups);
        $scope.columns = _.clone(res.data.columns);
      }
    })
    .error(function(data, status, headers, config) {
      ExMsgBox.error('error');
    });

  $scope.search = function () {
    $scope.queryRecords(null, null, $scope.query);
  };

  $scope.close = function () {
    $scope.record = {};
    $state.go('^');
  };
}]);


app.controller("AppFormController", ['$scope', 'APP', 'ResMgr', 'ExMsgBox', '$state', '$stateParams', '$http',
  function ($scope, APP, ResMgr, ExMsgBox, $state, $stateParams, $http) {
  window.AppFormController = $scope;
  $scope.record = {};

  $scope.loadConfig = function () {
    $http.get(APP.tplPrefix + $scope.model.url + '/config')
      .success(function(res) {
        if(res.success) {
          $scope.lookups = _.clone(res.data.lookups);
          $scope.formColumns = _.clone(res.data.formColumns);
          $scope.columns = _.clone(res.data.columns);
          $scope.options = _.clone(res.data.options);
          _.each(res.data.options, function(v, k) {
            $scope['options_' + k] = _.clone(v);
          });
        }
      })
      .error(function(data, status, headers, config) {
        ExMsgBox.error('error');
      });
  };

  $scope.loadRecord = function () {
    if($stateParams.id) {
      var data = { id: $stateParams.id };
      ResMgr.get($scope.model.name, data)
        .then(function (res) { $scope.record = res.data; })
        .catch(function (res) {
          angular.forEach(res.error.messages, function(msg) {
            ExMsgBox.error(msg);
          });
        });
    }
  };

  $scope.cancel = function () {
    $scope.record = {};
    $state.go('^');
  };

  $scope.successAlert = function (res, action) {
    ExMsgBox.success($scope.model.display + ' ' + action + ' successfully');
    $scope.record = {};
    $state.go('^');
    $scope.queryRecords();
  };

  $scope.errorAlert = function (res, action) {
    ExMsgBox.errorSummary(res.error.messages);
  };

  $scope.create = function () {
    var data = {};
    data[$scope.model.key] = $scope.record;
    ResMgr.create($scope.model.name, data)
      .then(function (res) { $scope.successAlert(res, "created"); })
      .catch(function (res) { $scope.errorAlert(res, "Create"); });
  };

  $scope.edit = function () {
    $state.go('^.edit', {id: $stateParams.id});
  };

  $scope.update = function () {
    var data = { id: $stateParams.id };
    data[$scope.model.key] = $scope.record;
    ResMgr.update($scope.model.name, data)
      .then(function (res) { $scope.successAlert(res, "updated"); })
      .catch(function (res) { $scope.errorAlert(res, "Update"); });
  };

  $scope.save = function () {
    if($stateParams.id) {
      $scope.update();
    } else {
      $scope.create();
    }
  };

  $scope.loadConfig();
  $scope.loadRecord();
}]);