'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('LoginCtrl', function ($scope, $auth, $http, $state, exMsg, APP) {
    var vm = $scope;
    window.loginCtrl = vm;
    
    vm.$on('auth:registration-email-success', function(ev, data) {
      var message = 'A registration email was ' + 'sent to ' + data.email + '. Follow the instructions contained in the email to complete registration.';
      exMsg.sweetAlert({
        title: 'Registration',
        text: message,
        type: 'success'
      });
    });

    vm.$on('auth:registration-email-error', function(ev, data) {
      // var messages = _.map(data.errors.full_messages, function (error) {
      //   return error.replace(/Email This/, 'This');
      // });

      // if (messages.length === 1) {
      //   exMsg.sweetAlert(messages[0]);
      // } else {
      //   exMsg.sweetAlert('Validation Error', messages.join('\n'), 'error');
      // }
    });

    vm.$on('auth:login-success', function(ev, user) {
      $state.go('app');
    });

    vm.$on('auth:login-error', function(ev, data) {
      exMsg.sweetAlert('Failed', data.errors[0], 'error');
    });

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

        $auth.requestPasswordReset({email: email})
          .then(function (data) {
            exMsg.sweetAlert('Successful', data.message, 'success');
          }).catch(function (data) {
            exMsg.sweetAlert('Error', data.errors[0], 'error');
          });
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

        $http.post(APP.apiPrefix + 'users/send_confirmation_instructions', {
          email: email,
          redirect_url: window.location.href.split('#')[0]
        }).success(function (data) {
          if(data.error) {
            exMsg.sweetAlert('Error', data.message, 'error');
          } else {
            exMsg.sweetAlert('Successful', data.message, 'success');
          }
        });
      });
    }
  });
