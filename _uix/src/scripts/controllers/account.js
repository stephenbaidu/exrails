
angular.module('uixApp')
  .controller('AccountCtrl', function ($scope, APP, $auth, $http, $state, exMsg, authService, $uibModalStack) {
    var vm = this;

    vm.model = {}
    vm.action = { updating: false, deleting: false };

    vm.initRoute = function () {
      vm.reset();
    }

    vm.reset = function () {
      vm.model = {};
      vm.model.name = $auth.user.name;
      vm.model.email = $auth.user.email;
    }

    vm.close = function () {
      if ($uibModalStack.getTop()) {
        $scope.$dismiss();
      }
      $state.go('^');
    }

    vm.update = function () {
      vm.action.updating = true;

      authService.updateUser(vm.model).finally(function () {
        $auth.validateToken().finally(function () {
          // vm.action.updating = false;
          // vm.model = angular.copy($auth.user);
          vm.close();
        });
      });
    }

    vm.delete = function () {
      vm.action.deleting = true;

      $http.post(APP.apiPrefix + 'users/' + $auth.user.id + '/delete_user')
        .success(function (data) {
          if (data.error) {
            exMsg.sweetAlert(data.message, (data.messages || []).join('\n'), 'error');
          } else {
            exMsg.sweetAlert('Great!', 'Your account has been scheduled for deletion', 'success');
          }
        }).catch(function (data) {
          exMsg.sweetAlert('Sorry!', 'Account deletion failed', 'error');
        }).finally(function () {
          vm.action.deleting = false;
        });
    }
  });