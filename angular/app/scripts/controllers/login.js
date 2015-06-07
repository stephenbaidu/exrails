'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('LoginCtrl', function ($scope, $rootScope, $auth, $state, exMsg, $modal, APP) {
    window.loginCtrl = $scope
    
    $scope.$on('auth:registration-email-success', function(ev, data) {
      var message = 'A registration email was ' + 'sent to ' + data.email + '. Follow the instructions contained in the email to complete registration.';
      exMsg.sweetAlert({
        title: 'Registration',
        text: message,
        type: 'success'
      });
    });

    $scope.$on('auth:registration-email-error', function(ev, data) {
      var messages = _.map(data.errors.full_messages, function (error) {
        return error.replace(/Email This/, 'This');
      });

      if (messages.length === 1) {
        exMsg.sweetAlert(messages[0]);
      } else {
        exMsg.sweetAlert('Validation Error', messages.join('\n'), 'error');
      }
    });

    $scope.$on('auth:login-success', function(ev, user) {
      $state.go('app.dashboard');
    });

    $scope.$on('auth:login-error', function(ev, data) {
      exMsg.sweetAlert('Failed', data.errors[0], 'error');
    });

    $scope.sendPasswordResetEmail = function () {
      exMsg.sweetAlert({
        title: 'Password Reset',
        text: 'Email',
        type: 'input',
        showCancelButton: true,
        animation: "slide-from-top"
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

    $scope.sendConfirmationInstructions = function () {
      exMsg.sweetAlert({
        title: 'Confirmation Instructions',
        text: 'Email',
        type: 'input',
        showCancelButton: true,
        animation: "slide-from-top"
      }, function (email) {
        //
      });
    }
  });
