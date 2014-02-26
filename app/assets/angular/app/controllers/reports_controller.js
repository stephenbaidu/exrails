var app = angular.module("app");

var ReportsController = function ($scope, $stateParams) {
  window.ReportsController = $scope;
  $scope.filter = {};
  $scope.report_filter = "";
  $scope.report_source = "";

  $scope.generateReport = function () {
    var url = null;

    if($stateParams.id) {
      url = 'reports/' + $stateParams.report + $stateParams.id + '.pdf';
    } else if($stateParams.report) {
      url = 'reports/' + $stateParams.report + '.pdf';
    }

    console.log('url', url + '?filter=' + $scope.report_filter)
    if(url) {
      $scope.report_source = url + '?filter=' + $scope.report_filter;
    }
  }
  $scope.generateReport();
  
  $scope.$watch('report_id', function() {
    if($scope.report_id) {
      $scope.report_source = 'reports/' + $stateParams.report + '/' + $scope.report_id + '.pdf?filter=' + $scope.report_filter;
    }
  });

  $scope.$watch('filter', function() {
    var _map = function (v, k) { return k + ':' + v };
    $scope.report_filter = _.chain($scope.filter).map(_map).join(',').value();
    console.log($scope.report_filter);
  }, true);
}

ReportsController.$inject = ['$scope', '$stateParams'];
app.controller('ReportsController', ReportsController);