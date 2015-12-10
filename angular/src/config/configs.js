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
        }
        else if (rejection.status === 404) {
          // exMsg.sweetAlert('Invalid request', '', 'error')
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

    formlyConfigProvider.setWrapper({
      name: 'validation',
      types: ['ex-input', 'ex-select', 'ex-select-multiple', 'ex-datepicker'],
      templateUrl: 'app/templates/error-messages.html'
    });
  })
  .run(function run(formlyConfig, formlyValidationMessages) {
    formlyConfig.extras.errorExistsAndShouldBeVisibleExpression = 'fc.$touched || form.$submitted';
    formlyValidationMessages.addStringMessage('required', 'This field is required'); 
  })
  .filter('whereMulti', function() {
    return function(items, key, values) {
      var out = [];
      if (angular.isArray(values)) {
        values.forEach(function(value) {
          for (var i = 0; i < items.length; i++) {
            if (value == items[i][key]) { out.push(items[i]); break; }
          }
        });
      }
      return out;
    };
  });
