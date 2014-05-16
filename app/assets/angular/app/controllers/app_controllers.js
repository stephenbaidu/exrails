var app = angular.module("app");

app.controller("AppController", ['$scope', 'APP', '$rootScope', 'ResMgr', '$state', '$stateParams',
  function ($scope, APP, $rootScope, ResMgr, $state, $stateParams) {
  window.AppController = $scope;

  // Global configurations
  $.pnotify.defaults.styling = "bootstrap3";
  $.pnotify.defaults.history = false;
  $.pnotify.defaults.delay   = 2000;
}]);

app.controller("AppIndexController", ['$scope', 'APP', '$q', 'ResMgr', 'ExMsgBox', '$state', '$stateParams', '$http',
  function ($scope, APP, $q, ResMgr, ExMsgBox, $state, $stateParams, $http) {
  window.AppIndexController = $scope;
  $scope.records = [];
  $scope.totalRecords = 0;
  $scope.recordsPerPage = 20;
  $scope.queryString = '';
  $scope.currentPage = 1;
  $scope.pageSizes = [5, 10, 15, 20, 25, 30, 50, 100, 500, 1000];
  $scope.model = ResMgr.register($stateParams.url, APP.apiPrefix + $stateParams.url.replace('-', '_') + '/:id');

  $scope.queryRecords = function (query, page, size) {
    query = query || {};
    query['page'] = page  || 1;
    query['size'] = size  || $scope.recordsPerPage;
    ResMgr.query($scope.model.name, query, function(data, totalRecords) {
        $scope.totalRecords = totalRecords;
        $scope.records = data;
      })
      .then(function (data) {
        // $scope.records = data;
      })
      .catch(function (error) {
        $scope.error(error);
      });
  };

  $scope.$watch('recordsPerPage', function() {
    $scope.queryRecords();
  });

  $scope.error = function (error) {
    error = error || {};
    error.message  && ExMsgBox.error(error.message, error.type || 'Error');
    error.messages && ExMsgBox.errorSummary(error.messages);
  }

  $scope.delete = function (id) {
    var msg = "Are you sure you want to Delete this " + $scope.model.display + "?";
    ExMsgBox.confirm(msg, "Confirm Delete").then(function () {
      var data = { id: id };
      data[$scope.model.key] = $scope.record;
      ResMgr.delete($scope.model.name, data)
        .then(function (data) {
          $scope.queryRecords();
          ExMsgBox.success($scope.model.name + " deleted successfully");
        })
        .catch(function (error) {
          $scope.error(error);
        });
    });
  };

  $http.get(APP.tplPrefix + $scope.model.url + '/config')
    .success(function(data) {
      $scope.lookups = _.clone(data.lookups);
      $scope.gridColumns = _.clone(data.gridColumns);
      $scope.columns = _.clone(data.columns);
      $scope.options = _.clone(data.options);
      _.each(data.options, function(v, k) {
        $scope['options_' + k] = _.clone(v);
      });
    })
    .error(function(data, status, headers, config) {
      //
    });
}]);


app.controller("AppSearchController", ['$scope', 'APP', 'ExMsgBox', '$state', '$http',
  function ($scope, APP, ExMsgBox, $state, $http) {
  window.AppSearchController = $scope;
  $scope.query = {};

  $http.get(APP.tplPrefix + $scope.model.url + '/config')
    .success(function(data) {
      $scope.lookups = _.clone(data.lookups);
      $scope.columns = _.clone(data.columns);
    })
    .error(function(data, status, headers, config) {
      ExMsgBox.error('error');
    });

  $scope.search = function () {
    $scope.queryRecords($scope.query);
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
      .success(function(data) {
        $scope.lookups = _.clone(data.lookups);
        $scope.formColumns = _.clone(data.formColumns);
        $scope.columns = _.clone(data.columns);
        $scope.options = _.clone(data.options);
        _.each(data.options, function(v, k) {
          $scope['options_' + k] = _.clone(v);
        });
      })
      .error(function(data, status, headers, config) {
        ExMsgBox.error('error');
      });
  };

  $scope.loadRecord = function () {
    if($stateParams.id) {
      var data = { id: $stateParams.id };
      ResMgr.get($scope.model.name, data)
        .then(function (data) { $scope.record = data; })
        .catch(function (error) {
          $scope.error(error);
        });
    }
  };

  $scope.cancel = function () {
    $scope.record = {};
    $state.go('^');
  };

  $scope.redirectBack = function () {
    $scope.record = {};
    $state.go('^');
    $scope.queryRecords();
  };

  $scope.create = function () {
    var data = {};
    data[$scope.model.key] = $scope.record;
    ResMgr.create($scope.model.name, data)
      .then(function (data) {
        ExMsgBox.success($scope.model.display + ' created successfully');
        $scope.redirectBack();
      })
      .catch(function (error) {
        $scope.error(error);
      });
  };

  $scope.edit = function () {
    $state.go('^.edit', {id: $stateParams.id});
  };

  $scope.update = function () {
    var data = { id: $stateParams.id };
    data[$scope.model.key] = $scope.record;
    ResMgr.update($scope.model.name, data)
      .then(function (data) {
        ExMsgBox.success($scope.model.display + ' updated successfully');
        $scope.redirectBack();
      })
      .catch(function (error) {
        $scope.error(error);
      });
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