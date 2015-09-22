
angular.module('angularApp')
  .run(function (gridService, fieldService) {
    // Set grid config
    gridService.set('role', gridConfig());

    // Set config for angular-formly
    fieldService.set('role', fieldConfig());

    function gridConfig () {
      return ['name', 'permissions', 'status'];
    }
    
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
              "key": "status",
              "type": "ex-input",
              "templateOptions": {
                "required": false,
                "label": "Status"
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
                  $scope.to.options = lookupService.get('role', 'permission');
                });
              }
            }
          ]
        }
      ];
    }
  });
