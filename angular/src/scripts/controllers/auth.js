'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AuthCtrl', function ($scope, $rootScope, APP, $auth, $http, $state, exMsg, $uibModalStack) {
    var vm = this;

    vm.user = {};
    vm.showLoginError = false;

    vm.submitLogin = function (user) {
      $auth.submitLogin(vm.user);
    }

    $rootScope.$on('auth:login-success', function(ev, resp) {
      $uibModalStack.dismissAll();
      $state.go('app');
    });

    $rootScope.$on('auth:login-error', function(ev, resp) {
      vm.showLoginError = true;
    });

    vm.submitRegistration = function (user) {
      $auth.submitRegistration(vm.user);
    }

    vm.backToSignIn = function () {
      $uibModalStack.dismissAll();
      $state.go('auth.signin');
    }

    vm.sendPasswordResetEmail = function () {
      exMsg.sweetAlert({
        title: 'Password Reset',
        text: 'Email',
        type: 'input',
        showCancelButton: true,
        animation: 'slide-from-top'
      }, function (email) {
        if (email === false) return false;
        if (email === '') {
          exMsg.sweetAlert.showInputError('No email provided!');
          return false
        }

        $auth.requestPasswordReset({email: email});
      });
    }

    vm.sendConfirmationInstructions = function () {
      exMsg.sweetAlert({
        title: 'Confirmation Instructions',
        text: 'Email',
        type: 'input',
        showCancelButton: true,
        animation: 'slide-from-top'
      }, function (email) {
        if (email === false) return false;
        if (email === '') {
          exMsg.sweetAlert.showInputError('No email provided!');
          return false
        }

        $http.post(APP.apiPrefix + 'users/send_confirmation_instructions', { email: email })
          .success(function (data) {
            if(data.error) {
              exMsg.sweetAlert('Error', data.message, 'error');
            } else {
              exMsg.sweetAlert('Successful', data.message, 'success');
            }
          });
      });
    }

    vm.sendUnlockInstructions = function () {
      // 
    }
  });