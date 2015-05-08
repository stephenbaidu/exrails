'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('MainCtrl', function ($rootScope, $scope, $auth, $state, notificationService, $modal, APP) {
    $rootScope.currentUser = {};
    var passwordChangeErrorModal, passwordChangeErrorScope, passwordChangeModal, passwordChangeSuccessModal;
    
    $rootScope.isoOptions = {
      itemSelector: '.portfolio-item',
      resizable: true,
      resizesContainer: true
    };

    $scope.slides = [
      { bg: 'bg-1.jpg', img: 'typo-1.png' },
      { bg: 'bg-2.jpg', img: 'typo-2.png' },
      { bg: 'bg-3.jpg', img: 'typo-3.png' }
    ];

    $scope.workTags = [
      {name: 'Web Design', tag: 'web'},
      {name: 'Graphic Design', tag: 'graphic'},
      {name: 'Photography', tag: 'photography'},
      {name: 'Motion Graphics', tag: 'motion'},
      {name: 'Branding', tag: 'branding'},
    ];

    $scope.recentWorks = [
      {img: 'project-1.jpg', tags: 'others payslip staff'},
      {img: 'project-2.jpg', tags: 'reports payroll'},
      {img: 'project-3.png', tags: 'others staff'},
      {img: 'project-4.png', tags: 'payslip payroll'},
      {img: 'project-5.png', tags: 'reports staff'},
      {img: 'project-6.jpg', tags: 'others payroll'},
      {img: 'project-7.jpg', tags: 'payslip reports others payroll'},
      {img: 'project-8.jpg', tags: 'reports payslip staff'}
    ];

    $rootScope.showErrors = function (errors) {
      if(!errors) return;
      angular.forEach(errors, function (error) {
        notificationService.error(error);
      });
    };

    $scope.$on('auth:registration-email-success', function(ev, data) {
      notificationService.info('A registration email was ' + 'sent to ' + data.email + '. Follow the instructions contained in the email to complete registration.');
    });
    $scope.$on('auth:registration-email-error', function(ev, data) {
      console.log(data);
      angular.forEach(data.errors.full_messages, function (error) {
        notificationService.error(error);
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
    // $scope.$on('auth:password-reset-request-success', function(ev, params) {
    //   return $modal.open({
    //     title: "Success",
    //     html: true,
    //     template: "<div id='alert-password-reset-request-success'>Password reset instructions have been sent to " + params.email + "</div>"
    //   });
    // });
    // $scope.$on('auth:password-reset-request-error', function(ev, data) {
    //   return $modal.open({
    //     title: "Error",
    //     html: true,
    //     template: "<div id='alert-password-reset-request-error'>Error: " + _.map(data.errors).toString() + "</div>"
    //   });
    // });
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
      $state.go('app.module.model', {module: 'module1', model: 'samples'});
    });
    $scope.$on('auth:login-error', function(ev, data) {
      $rootScope.currentUser = {};
      notificationService.error('Authentication failure: ' + data.errors[0]);
    });
    
    $scope.$on('auth:account-update-success', function() {
      notificationService.info('Your account has been updated.');
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
      notificationService.error('Your account has been destroyed.');
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
