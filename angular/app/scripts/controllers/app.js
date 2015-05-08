'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AppCtrl', function ($scope, $rootScope, $http, $auth, $q, $modal, $state, APP, notificationService) {

    $rootScope.modules = APP['modules'] || {};
    
    $rootScope.state = {
      isIndex: true,
      isNew: false,
      isShow: false,
      isEdit: false,
      update: function (state) {
        if (!state) return;
        
        this.isIndex = (state.name == 'app.module.model');
        this.isNew   = (state.name == 'app.module.model.new');
        this.isShow  = (state.name == 'app.module.model.show');
        this.isEdit  = (state.name == 'app.module.model.edit');
      }
    };

    $rootScope.back = function () {
      $state.go('^');
    }

    $rootScope.state.update($rootScope.state.update($state.current));

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      $rootScope.state.update(toState);
    });

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

    $http.get(APP.apiPrefix + 'users/' + $auth.user.id)
      .success(function (data) {
        $auth.user.company = data.tenant.name;
      });

    $scope.$on('auth:logout-success', function(ev) {
      notificationService.info('Goodbye');
      $state.go('login');
    });
    $scope.$on('auth:logout-error', function(ev) {
      notificationService.error('Unable to complete logout. Please try again.');
    });

    $rootScope.confirmDialog = function (message, title) {
      var d = $q.defer();
      var dialog = $modal.open({
        template: function() {
          return  '<div class="modal ex-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" ng-click="cancel()">×</button><h4 class="modal-title">{{ title }}</h4></div><div class="modal-body"> {{ message }} </div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;&nbsp;&nbsp;Yes</button><button class="btn btn-warning" ng-click="cancel()"><i class="fa fa-times-circle"></i>&nbsp;&nbsp;&nbsp;&nbsp;No</button></div></div></div></div>'
        },
        controller: function($scope, $modalInstance) {
          $scope.message = message;
          $scope.title = title;

          $scope.ok = function () {
            $modalInstance.close();
            d.resolve(true);
          };

          $scope.cancel = function () {
            $modalInstance.dismiss();
            d.reject(false)
          };
        }
      });
      return d.promise;
    };

    $rootScope.errorSummary = function (messages) {
      var message = "<ul>";
      angular.forEach(messages, function(value){
        message += "<li>" + value + "</li>";
      });
      message += "</ul>";
      notificationService.notify({
        title: 'Error Summary',
        text:  message,
        type: 'error',
        hide: false
      });
    };
  });
