'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($rootScope, $scope, $auth, $state, exMsgBox, $modal, APP) {
    var passwordChangeErrorModal, passwordChangeErrorScope, passwordChangeModal, passwordChangeSuccessModal;

    $rootScope.showErrors = function (errors) {
      if(!errors) return;
      angular.forEach(errors, function (error) {
        exMsgBox.error(error);
      });
    };

    $rootScope.sendPasswordResetEmail = function () {
      (new PNotify({
        title: 'Request Password Reset',
        text: 'Email',
        icon: 'glyphicon glyphicon-question-sign',
        hide: false,
        confirm: {
            prompt: true
        },
        buttons: {
            closer: false,
            sticker: false
        },
        history: {
            history: false
        },
        before_open: function(pnotify){
          pnotify.get().css({
            top: "20px", 
            left: ($(window).width() / 2) - (pnotify.get().width() / 2)
          });
        }
      })).get().on('pnotify.confirm', function(e, notice, val) {
        var regExp = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (regExp.test(val)) {
          console.log('Valid');
          $auth.requestPasswordReset({email: val});
        } else {
          notice.remove();
          exMsgBox.notify({
            title: 'Invalid email',
            text: 'You provided an invalid email',
            type: 'error'
          });
        }
      }).on('pnotify.cancel', function(e, notice) {
        notice.remove();
      });
    }

    $scope.$on('auth:registration-email-success', function(ev, data) {
      exMsgBox.info('A registration email was ' + 'sent to ' + data.email + '. Follow the instructions contained in the email to complete registration.');
    });
    $scope.$on('auth:registration-email-error', function(ev, data) {
      console.log(data);
      angular.forEach(data.errors.full_messages, function (error) {
        exMsgBox.error(error);
      });
    });
    // $scope.$on('auth:email-confirmation-success', function(ev, data) {
    //   return $modal.open({
    //     title: "Success!",
    //     html: true,
    //     template: "<div id='alert-email-confirmation-success'>Welcome " + data.email + ". Your account has been successfully created.</div>"
    //   });
    // });
    // $scope.$on('auth:email-confirmation-error', function(ev, data) {
    //   return $modal.open({
    //     title: "Error!",
    //     html: true,
    //     template: "<div id='alert-email-confirmation-error'>Unable to confirm your account. Request a password reset to verify your identity.</div>"
    //   });
    // });

    $scope.$on('auth:password-reset-request-success', function(ev, data, data2) {
      exMsgBox.info('An email has been sent to ' + data.email +
        ' containing instructions for resetting your password.');
    });

    $scope.$on('auth:password-reset-request-error', function(ev, data) {
      exMsgBox.error(_.map(data.errors).toString());
    });

    // $scope.$on('auth:password-reset-confirm-error', function(ev, data) {
    //   return $modal.open({
    //     title: "Error",
    //     html: true,
    //     template: "<div id='alert-password-reset-request-error'>Error: " + _.map(data.errors).toString() + "</div>"
    //   });
    // });
    passwordChangeModal = function () {
      $modal.open({
        title: "Change your password!",
        html: true,
        show: false,
        templateUrl: 'views/partials/password-reset-modal.html'
      });
    };
    
    passwordChangeSuccessModal = function () {
      $modal.open({
        title: "Success",
        html: true,
        show: false,
        template: "<div id='alert-password-change-success'>Your password has been successfully updated."
      });
    };
    passwordChangeErrorScope = $scope.$new();
    passwordChangeErrorModal = function () {
      $modal.open({
        title: "Error",
        html: true,
        show: false,
        scope: passwordChangeErrorScope,
        templateUrl: 'views/partials/password-change-error-modal.html'
      });
    };
    $scope.showPasswordChangeModal = function() {
      passwordChangeModal();
    };
    $scope.$on('auth:password-reset-confirm-success', function() {
      passwordChangeModal();
    });
    $scope.$on('auth:password-change-success', function() {
      passwordChangeModal.hide();
      return passwordChangeSuccessModal.show();
    });
    $scope.$on('auth:password-change-error', function(ev, data) {
      passwordChangeErrorScope.errors = data.errors;
      passwordChangeModal.hide();
      passwordChangeErrorModal();
    });
    passwordChangeErrorScope.$on('modal.hide', function() {
      passwordChangeModal();
    });
    $scope.$on('auth:login-success', function(ev, user) {
      $state.go('app.dashboard');
    });
    $scope.$on('auth:login-error', function(ev, data) {
      exMsgBox.error('Authentication failure: ' + data.errors[0]);
    });
    
    $scope.$on('auth:account-update-success', function() {
      exMsgBox.info('Your account has been updated.');
    });
    // $scope.$on('auth:account-update-error', function(ev, data) {
    //   var errors;
    //   errors = _(data.errors).map(function(v, k) {
    //     return "" + k + ": " + v + ".";
    //   }).value().join("<br/>");
    //   return $modal.open({
    //     title: "Error",
    //     html: true,
    //     template: "<div id='alert-account-update-error'>Unable to update your account. " + errors + "</div>"
    //   });
    // });
    $scope.$on('auth:account-destroy-success', function() {
      exMsgBox.error('Your account has been destroyed.');
    });
    // return $scope.$on('auth:account-destroy-error', function(ev, data) {
    //   var errors;
    //   errors = _(data.errors).map(function(v, k) {
    //     return "" + k + ": " + v + ".";
    //   }).value().join("<br/>");
    //   return $modal.open({
    //     title: "Error",
    //     html: true,
    //     template: "<div id='alert-account-destroy-error'>Unable to destroy your account. " + errors + "</div>"
    //   });
    // });

    $scope.signup = function () {
      $auth.submitRegistration($scope.signupData)
        .then(function (resp) {
          //
        })
        .catch(function (resp) {
          $scope.showErrors(resp.data.errors.full_messages);
        });
    };

    $scope.test = function () {
      // $auth.
    };
  });
