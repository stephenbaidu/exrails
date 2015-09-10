'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $auth, $http, $state, exMsg, APP) {
    var vm = $scope;
    window.loginCtrl = vm;

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
  });
