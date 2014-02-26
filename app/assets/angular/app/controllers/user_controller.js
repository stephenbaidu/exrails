var app = angular.module("app");

var UserController = function ($scope, ResMgr, ExMsgBox, $http, $state, $stateParams, $filter) {
  window.UserController = $scope;

  var col_attrs = 'style="width: 100px; text-align: right"';

  $scope.r_cols = [
    { name: "id", header: "Name", lookup: "role"},
    { name: "permissions", header: "Permissions", attrs: col_attrs, fixed: true }
  ];

  var permissionCount = function (role_id) {
    var role = $filter('getLookupById')($scope.lookups['role'], role_id)
    return (role && _.size(role.permissions) || 0)
  }

  $scope.$watch('record', function() {
    $scope.$parent.record.user_roles_attributes = [];
    _.each($scope.$parent.record.role_ids, function (e) {
      $scope.$parent.record.user_roles_attributes.push({
        id: e,
        permissions: permissionCount(e)
      });
    });
  });

  $scope.$watch('record.user_roles_attributes', function (argument) {
    var fnMap = function (r) { return parseInt(r.id) }
    $scope.$parent.record.role_ids = _.map($scope.record.user_roles_attributes, fnMap)
    _.each($scope.record.user_roles_attributes, function (e) {
      e.permissions = permissionCount(e.id);
    });
  }, true);

};

UserController.$inject = ['$scope', 'ResMgr', 'ExMsgBox', '$http', '$state', '$stateParams', '$filter'];
app.controller('UserController', UserController);
