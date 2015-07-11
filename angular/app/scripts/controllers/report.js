'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:ReportCtrl
 * @description
 * # ReportCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('ReportCtrl', function ($scope, APP, $http, $state, $stateParams, $sce) {
    var vm = $scope;
    window.reportCtrl = vm;

    vm.action = {generating: false};

    vm.report = {};
    vm.filter = {};

    vm.reports = {
      'samples': {
        name: 'samples',
        title: 'Samples',
        // url: APP.apiPrefix + 'reports/samples',
        fields: []
      },
      'sample-info': {
        name: 'sample',
        title: 'Sample',
        fields: [
          {
            key: 'sample_id',
            type: 'select',
            templateOptions: {
              label: 'Select Sample',
              valueProp: 'id',
              labelProp: 'name',
              options: []
            },
            controller: function($scope, $http) {
              $http.get(APP.apiPrefix + 'samples')
                .success(function (data) {
                  $scope.to.options = data;
                })
            }
          }
        ]
      }
    };

    vm.generateReport = function () {
      vm.action.generating = true;
      var url = vm.report.url || APP.apiPrefix + 'reports/' + vm.report.name + '';
      $http.get(url, { params: vm.filter })
        .success(function (data) {
          var fileURL = 'data:application/pdf;base64,' + data;
          vm.pdfSrc = $sce.trustAsResourceUrl(fileURL);
        })
        .finally(function () {
          vm.action.generating = false;
        });
    }

    vm.renderReportPage = function () {
      var reportId = $stateParams.report;
      vm.report = vm.reports[reportId];
      if (vm.report && vm.report.fields) {
        vm.fields = vm.report.fields;
      }
    };

    vm.renderReportPage();
  });
