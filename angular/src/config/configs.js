angular.module('angularApp')
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
          $location.path('/login');
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
      name: 'ex-input',
      templateUrl: 'app/templates/ex-input.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'ex-select',
      templateUrl: 'app/templates/ex-select.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'ex-select-multiple',
      templateUrl: 'app/templates/ex-select-multiple.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'ex-datepicker',
      templateUrl: 'app/templates/ex-datepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'ex-timepicker',
      templateUrl: 'app/templates/ex-timepicker.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });
    formlyConfigProvider.setType({
      name: 'ex-checkbox',
      templateUrl: 'app/templates/ex-checkbox.html',
      wrapper: ['bootstrapLabel', 'bootstrapHasError'],
      overwriteOk: true
    });

    formlyConfigProvider.setWrapper({
      name: 'validation',
      types: ['ex-input', 'ex-select', 'ex-select-multiple', 'ex-datepicker'],
      templateUrl: 'app/templates/error-messages.html'
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
