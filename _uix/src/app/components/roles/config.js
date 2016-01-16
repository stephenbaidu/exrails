
angular.module('uixApp')
  .controller('RoleIndexCtrl', function ($scope, APP, $http, exMsg) {
    
    $scope.$on('uix:index-ready', function (evt, modelName, config, scope) {
      if (modelName !== 'Role') return;
      // Do something
    });
  });

angular.module('uixApp')
  .controller('RoleFormCtrl', function ($scope, APP, $http, exMsg) {
    
    $scope.$on('uix:form-ready', function (evt, modelName, config, scope) {
      if (modelName !== 'Role') return;
      // Do something
    });

    $scope.$on('uix:record-loaded', function (evt, modelName, record, scope) {
      if (modelName !== 'Role') return;
      // Do something
    });
  });

angular.module('uixApp')
  .run(function (fieldService) {
    // Set config for angular-formly
    fieldService.set('role', fieldConfig());
    
    function fieldConfig () {
      return [
        {
          "fieldGroup": [
            {
              "className": "col-xs-6",
              "key": "name",
              "type": "ex-input",
              "templateOptions": {
                "required": true,
                "label": "Name"
              }
            },
            {
              "className": "col-xs-6",
              "key": "description",
              "type": "ex-input",
              "templateOptions": {
                "required": false,
                "label": "Description"
              }
            }
          ]
        },
        {
          "fieldGroup": [
            {
              "className": "col-xs-12 large-tags",
              "key": "permissions",
              "type": "ex-select-multiple",
              "templateOptions": {
                "required": false,
                "label": "Permissions",
                "valueProp": "name",
                "labelProp": "name",
                "options": []
              },
              "controller": /* @ngInject */ function($scope, lookupService) {
                lookupService.load('role', 'permission').then(function() {
                  $scope.to.options = lookupService.get('permission');
                });
              }
            }
          ]
        }
      ];
    }
  });

angular.module('uixApp')
  .run(function (schemaService) {
    // Set config for json-schema
    schemaService.set('role', schemaConfig());
    
    function schemaConfig () {
      return {
        "type": "object",
        "title": "Role",
        "required": [
          "name",
          "name"
        ],
        "properties": {
          "name": {
            "key": "name",
            "title": "Name",
            "type": "string",
            "format": "text"
          },
          "permissions": {
            "key": "permissions",
            "title": "Permissions",
            "type": "string",
            "format": "text"
          },
          "status": {
            "key": "status",
            "title": "Status",
            "type": "string",
            "format": "text"
          }
        }
      };
    }
  });
