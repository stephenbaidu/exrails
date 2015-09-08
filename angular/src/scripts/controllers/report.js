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
      'user_info': {
        name: 'user_info',
        title: 'User',
        fields: [{
          key: 'user_id',
          type: 'select',
          templateOptions: {
            label: 'Select User',
            valueProp: 'id',
            labelProp: 'name',
            options: []
          },
          controller: /* @ngInject */ function($scope, $http) {
            $http.get(APP.apiPrefix + 'users?size=200')
              .success(function (data) {
                $scope.options.templateOptions.options = data;
              })
          }
        }]
      },
      'users': {
        name: 'users',
        title: 'Users',
        fields: []
      },
      'roles': {
        name: 'roles',
        title: 'Roles',
        fields: []
      }
    };

    vm.generateReport = function () {
      vm.action.generating = true;
      var url = vm.report.url || APP.apiPrefix + 'reports/' + vm.report.name;
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

    vm.previewReport = function () {
      vm.action.generating = true;
      var url = vm.report.url || APP.apiPrefix + 'reports/' + vm.report.name + '.html';
      $http.get(url, { params: vm.filter })
        .success(function (data) {
          vm.report.html = $sce.trustAsHtml(data);
        })
        .finally(function () {
          vm.action.generating = false;
        });
    }

    vm.downloadAsCSV = function () {
      vm.action.generating = true;
      var url = vm.report.url || APP.apiPrefix + 'reports/' + vm.report.name + '.csv';
      $http.get(url, { params: vm.filter })
        .success(function (data) {
          console.log(data);
          var fileURL = 'data:text/csv;charset=utf-8,' + data;
          var pdfURI = $sce.trustAsResourceUrl(fileURL);     
          var downloadLink = angular.element('<a></a>');
          downloadLink.attr('href', pdfURI);
          downloadLink.attr('download', vm.report.name + '.csv');
          downloadLink[0].click();
        })
        .finally(function () {
          vm.action.generating = false;
        });
    }

    vm.downloadAsXLS = function () {
      vm.action.generating = true;
      var url = vm.report.url || APP.apiPrefix + 'reports/' + vm.report.name + '.xls';
      $http.get(url, { params: vm.filter })
        .success(function (data) {
          console.log(data);
          var fileURL = 'data:application/xls;' + data;
          var pdfURI = $sce.trustAsResourceUrl(fileURL);     
          var downloadLink = angular.element('<a></a>');
          downloadLink.attr('href', pdfURI);
          downloadLink.attr('download', vm.report.name + '.xls');
          downloadLink[0].click();
        })
        .finally(function () {
          vm.action.generating = false;
        });
    }

    vm.downloadAsPDF = function () {
      vm.action.generating = true;
      var url = vm.report.url || APP.apiPrefix + 'reports/' + vm.report.name + '.pdf';
      $http.get(url, { params: vm.filter })
        .success(function (data) {
          var fileURL = 'data:application/pdf;base64,' + data;
          var pdfURI = $sce.trustAsResourceUrl(fileURL);     
          var downloadLink = angular.element('<a></a>');
          downloadLink.attr('href', pdfURI);
          downloadLink.attr('download', vm.report.name + '.pdf');
          downloadLink[0].click();
        })
        .finally(function () {
          vm.action.generating = false;
        });
    }

    vm.renderReportPage();
  });
