'use strict';

/**
 * @ngdoc function
 * @name uixApp.controller:AuthCtrl
 * @description
 * # AuthCtrl
 * Controller of the uixApp
 */
angular.module('uixApp')
  .controller('AuthCtrl', function (APP, $auth, $http, $state, exMsg, $uibModalStack) {
    var vm = this;

    vm.user = {};
    vm.view = 'signin';
    vm.action = { executed: false, success: false, message: '' };

    vm.submitUserLogin = function (user) {
      vm.action = {};

      $auth.submitLogin(vm.user).then(function () {
        $uibModalStack.dismissAll();
        $state.go('app');
      }).catch(function (data) {
        vm.action.executed = true;
        vm.action.success = false;
      });
    }

    vm.submitUserRegistration = function (user) {
      vm.action = {};
      user.name = user.email;

      $auth.submitRegistration(vm.user).then(function (data) {
        console.log(data);
        vm.action.success = true;
        var message = 'A registration email was sent to ' + data.data.data.email + '. Follow the instructions contained in the email to complete registration.'
        vm.action.message = message;
      }).catch(function (data) {
        console.log(data);
        vm.action.success = false;
        vm.action.message = data.data.errors.full_messages[0];
      }).finally(function () {
        vm.action.executed = true;
      });
    }

    vm.goToSignUp = function () {
      vm.user = {};
      vm.action = {};
      vm.view = 'signup';
    }

    vm.goToResetPassword = function () {
      vm.user = {};
      vm.action = {};
      vm.view = 'reset-password';
    }

    vm.backToSignIn = function () {
      vm.user = {};
      vm.action = {};
      vm.view = 'signin';
    }

    vm.sendPasswordResetEmail = function (email) {
      vm.action = {};

      $auth.requestPasswordReset({email: email}).then(function (data) {
        console.log(data);
        vm.action.success = true;
        vm.action.message = data.data;
      }).catch(function (data) {
        console.log(data);
        vm.action.success = false;
        vm.action.message = data.data.errors[0];
      }).finally(function () {
        vm.action.executed = true;
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
              exMsg.sweetAlert('success', data.message, 'success');
            }
          });
      });
    }

    vm.sendUnlockInstructions = function () {
      // 
    }
  });