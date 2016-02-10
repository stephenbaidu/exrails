angular.module('uixApp')
  .config(function($authProvider) {
    $authProvider.configure({
      apiUrl: '/api',
      confirmationSuccessUrl:  window.location.href.split('#')[0],
    });
  })
  .factory('responseInterceptor', function($q, $location){
    return {
      responseError: function(rejection) {
        if (rejection.status === 401) {
          $location.path('/auth/login');
        } else if (rejection.status === 404) {
          // Not found
        } else if (rejection.status === 601) { // Password expired
          $location.path('/account');
        }
        return $q.reject(rejection);
      }
    }
  })
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('responseInterceptor');
  })
  .factory('$exceptionHandler', function() {
    return function(exception, cause) {};
  })
  .run(function(editableOptions) {
    editableOptions.theme = 'bs3';
  })
  .config(function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  })
  .config(function(formlyConfigProvider) {
    formlyConfigProvider.setType({
      name: 'uix-input',
      templateUrl: 'config/templates/uix-input.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'uix-select',
      templateUrl: 'config/templates/uix-select.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'uix-select-multiple',
      templateUrl: 'config/templates/uix-select-multiple.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'uix-datepicker',
      templateUrl: 'config/templates/uix-datepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'uix-timepicker',
      templateUrl: 'config/templates/uix-timepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'uix-checkbox',
      templateUrl: 'config/templates/uix-checkbox.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'uix-textarea',
      templateUrl: 'config/templates/uix-textarea.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'uix-file',
      templateUrl: 'config/templates/uix-file.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });

    formlyConfigProvider.setWrapper({
      name: 'validation',
      types: ['uix-input', 'uix-select', 'uix-select-multiple', 'uix-datepicker', 'uix-file'],
      templateUrl: 'config/templates/error-messages.html'
    });
  })
  .run(function run(formlyConfig, formlyValidationMessages) {
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
    formlyValidationMessages.addStringMessage('required', 'This field is required'); 
    formlyValidationMessages.addTemplateOptionValueMessage('pattern', 'patternValidationMessage', '', '', 'Invalid Input');
  })
  .filter('whereMulti', function() {
    return function(items, key, values) {
      return _(items).indexBy(key).at(values).value();
    };
  });
