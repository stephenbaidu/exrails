var app = angular.module("app");

app.service("ExMsgBox", ['$modal', '$q', function ($modal, $q) {
  return {
    success: function(message, title) {
      title = title || 'Success';
      $.pnotify({
        title: title,
        text:  message,
        type: 'success',
        nonblock: true,
        // closer: true,
        nonblock_opacity: .2
      });
    },
    error: function(message, title) {
      title = title || 'Error';
      $.pnotify({
        title: title,
        text:  message,
        type: 'error',
        nonblock: true,
        nonblock_opacity: .2
      });
    },
    notice: function(message, title) {
      // title will not be used but available
      $.pnotify({
        text: message,
        type: 'notice',
        nonblock: true,
        nonblock_opacity: .5
      });
    },
    info: function (message, title) {
      title = title || 'Info';
      $.pnotify({
        title: title,
        text: message,
        addclass: 'custom',
        // icon: 'picon picon-32 picon-fill-color',
        opacity: .8,
        nonblock: true,
        nonblock_opacity: .2
      });
    },
    errorSummary: function(messages) {
      var message = "<ul>";
      angular.forEach(messages, function(value){
        message += "<li>" + value + "</li>";
      });
      message += "</ul>";
      $.pnotify({
        title: 'Error Summary',
        text:  message,
        type: 'error',
        hide: false
      });
    },
    confirm: function(message, title) {
      var d = $q.defer();
      var dialog = $modal.open({
        template: function() {
          return  '<div class="modal ex-modal"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><button type="button" class="close" ng-click="cancel()">×</button><h4 class="modal-title">{{ title }}</h4></div><div class="modal-body"> {{ message }} </div><div class="modal-footer"><button class="btn btn-primary" ng-click="ok()"><i class="fa fa-check-circle"></i>&nbsp;&nbsp;&nbsp;&nbsp;Yes</button><button class="btn btn-warning" ng-click="cancel()"><i class="fa fa-times-circle"></i>&nbsp;&nbsp;&nbsp;&nbsp;No</button></div></div></div></div>'
        },
        controller: ['$scope', '$modalInstance', function($scope, $modalInstance) {
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
        }]
      });
      return d.promise;
    }
  };
}]);
