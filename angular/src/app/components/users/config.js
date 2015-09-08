
angular.module('angularApp')
  .run(function (formService, fieldService) {
    // Set config for angular-schema-form
    formService.set('user', formConfig());

    // Set config for angular-formly
    fieldService.set('user', fieldConfig());

    function formConfig () {
      return [
        // 
      ];
    }
    
    function fieldConfig () {
      return [
        // 
      ];
    }
  });
