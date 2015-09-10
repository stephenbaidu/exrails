'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:NgTokenAuthEventsCtrl
 * @description
 * # NgTokenAuthEventsCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('NgTokenAuthEventsCtrl', function ($scope, $rootScope, $auth, exMsg, $state) {
    var vm = $scope;
    window.ngTokenAuthEventsCtrl = vm;
    window.exMsg = exMsg;

    PNotify.prototype.options.delay = 3000;

    vm.$on('auth:login-success', function(ev, user) {
      console.log('auth:login-success');
      exMsg.info('Welcome, ' + user.email);
      $state.go('app');
    });

    vm.$on('auth:login-error', function(ev, resp) {
      console.log('auth:login-error');
      var text = resp.errors[0];
      exMsg.sweetAlert({title: 'Login Failed', text: text, type: 'error', animation: 'slide-from-top'});
    });

    vm.$on('auth:invalid', function (ev) {
      console.log('auth:invalid');
      exMsg.error('auth:invalid');
    });

    vm.$on('auth:validation-success', function (ev) {
      console.log('auth:validation-success');
      if ($state.$current.name === 'login') {
        $state.go('app');
      }
    });

    vm.$on('auth:validation-error', function (ev) {
      console.log('auth:validation-error');
      exMsg.error('auth:validation-error');
    });

    vm.$on('auth:logout-success', function(ev) {
      console.log('auth:logout-success');
      exMsg.info('Goodbye');
      if ($state.$current.name !== 'login') {
        $state.go('login');
      }
    });

    vm.$on('auth:logout-error', function(ev, resp) {
      console.log('auth:logout-error');
      exMsg.error('Unable to complete logout. Please try again.');
    });

    // vm.$on('auth:oauth-registration', function(ev, user) {
    //   console.log('auth:oauth-registration');
    //   exMsg.info('New user registered through oauth:' + user.email);
    // });

    vm.$on('auth:registration-email-success', function(ev, resp) {
      console.log('auth:registration-email-success');
      var text = 'A registration email was sent to ' + resp.email + '. Follow the instructions contained in the email to complete registration.';
      exMsg.sweetAlert({title: 'Registration Successful', text: text, type: 'success', animation: 'slide-from-top'}, function () {
        $state.go('.', {}, { reload: true });
      });
    });

    vm.$on('auth:registration-email-error', function(ev, resp) {
      console.log('auth:registration-email-error');
      var text = resp.errors.full_messages[0];
      exMsg.sweetAlert({title: 'Registration Failed', text: text, type: 'error', animation: 'slide-from-top'});
    });

    $rootScope.$on('auth:email-confirmation-success', function(ev, user) {
      console.log('auth:email-confirmation-success');
      var text = 'Your account has been verified';
      exMsg.sweetAlert({title: 'Welcome, ' + user.name, text: text, type: 'info', animation: 'slide-from-top'});
    });

    vm.$on('auth:email-confirmation-error', function(ev, resp) {
      console.log('auth:email-confirmation-error');
      exMsg.error('There was an error with your registration.');
    });

    vm.$on('auth:password-reset-request-success', function(ev, resp) {
      console.log('auth:password-reset-request-success');
      var text = 'Password reset instructions were sent to ' + resp.email
      exMsg.sweetAlert({title: 'Password Reset', text: text, type: 'info', animation: 'slide-from-top'});
    });

    vm.$on('auth:password-reset-request-error', function(ev, resp) {
      console.log('auth:password-reset-request-error');
      var text = resp.errors[0];
      exMsg.sweetAlert({title: 'Failed', text: text, type: 'error', animation: 'slide-from-top'});
    });

    vm.$on('auth:password-reset-confirm-success', function() {
      console.log('auth:password-reset-confirm-success');
      // $state.go('maintenance');
      // show password change modal
      exMsg.sweetAlert({
        title: 'Reset Password',
        text: 'New Password:',
        type: 'input',
        inputType: 'password',
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
        inputPlaceholder: 'New Password'
      }, function(password) {
        if (password === false) return false;
        if (password === '') {
          exMsg.sweetAlert.showInputError('No password provided!');
          return false
        }
        exMsg.sweetAlert({
          title: 'Reset Password',
          text: 'New Password Again:',
          type: 'input',
          inputType: 'password',
          showCancelButton: true,
          closeOnConfirm: false,
          animation: 'slide-from-top',
          inputPlaceholder: 'New Password Again'
        }, function(passwordConfirmation) {
          if (passwordConfirmation === false) return false;
          if (passwordConfirmation === '') {
            exMsg.sweetAlert.showInputError('No password provided!');
            return false
          }

          $auth.updatePassword({password: password, password_confirmation: passwordConfirmation});
        })
      });
    });

    vm.$on('auth:password-reset-confirm-error', function(ev, resp) {
      console.log('auth:password-reset-confirm-error');
      var text = 'Unable to verify your account. Please try again.';
      exMsg.sweetAlert({title: 'Failed', text: text, type: 'error', animation: 'slide-from-top'});
    });

    vm.$on('auth:password-change-success', function(ev) {
      console.log('auth:password-change-success');
      var text = 'Your password has been successfully updated!';
      exMsg.sweetAlert({title: 'Successful', text: text, type: 'info', animation: 'slide-from-top'});
    });

    vm.$on('auth:password-change-error', function(ev, resp) {
      console.log('auth:password-change-error');
      var text = 'Registration failed: ' + resp.errors[0];
      exMsg.sweetAlert({title: 'Failed', text: text, type: 'error', animation: 'slide-from-top'});
    });

    vm.$on('auth:account-update-success', function(ev) {
      console.log('auth:account-update-success');
      var text = 'Your account has been successfully updated!';
      exMsg.sweetAlert({title: 'Successful', text: text, type: 'info', animation: 'slide-from-top'});
    });

    vm.$on('auth:account-update-error', function(ev, resp) {
      console.log('auth:account-update-error');
      var text = 'Registration failed: ' + resp.errors[0];
      exMsg.sweetAlert({title: 'Failed', text: text, type: 'error', animation: 'slide-from-top'});
    });

    vm.$on('auth:account-destroy-success', function(ev) {
      console.log('auth:account-destroy-success');
      var text = 'Your account has been successfully destroyed!';
      exMsg.sweetAlert({title: 'Successful', text: text, type: 'info', animation: 'slide-from-top'});
    });

    vm.$on('auth:account-destroy-error', function(ev, resp) {
      console.log('auth:account-destroy-error');
      var text = 'Account deletion failed: ' + resp.errors[0];
      exMsg.sweetAlert({title: 'Failed', text: text, type: 'error', animation: 'slide-from-top'});
    });

    vm.$on('auth:session-expired', function(ev) {
      console.log('auth:session-expired');
      exMsg.info('Session has expired');
    });
  });
