
angular.module('angularApp')
  .run(function (formService, fieldService) {
    // Set config for angular-schema-form
    formService.set('role', formConfig());

    // Set config for angular-formly
    fieldService.set('role', fieldConfig());

    function formConfig () {
      return [
        {
          "type": "section",
          "htmlClass": "row",
          "items": [
            {
              "type": "section",
              "htmlClass": "col-sm-6 col-xs-12",
              "items": [
                {
                  "key": "name",
                  "fieldHtmlClass": "input-lg"
                }
              ]
            },
            {
              "type": "section",
              "htmlClass": "col-sm-6 col-xs-12",
              "items": [
                {
                  "key": "status",
                  "fieldHtmlClass": "input-lg"
                }
              ]
            }
          ]
        },
        {
          "type": "section",
          "htmlClass": "row",
          "items": [
            {
              "type": "section",
              "htmlClass": "col-xs-12",
              "items": [
                {
                  "key": "permissions",
                  "fieldHtmlClass": "input-lg"
                }
              ]
            }
          ]
        }
      ];
    }
    
    function fieldConfig () {
      return [
        {
          "fieldGroup": [
            {
              "className": "col-xs-6",
              "key": "name",
              "type": "input",
              "templateOptions": {
                "required": true,
                "label": "Name"
              }
            },
            {
              "className": "col-xs-6",
              "key": "status",
              "type": "input",
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
              "className": "col-xs-12",
              "key": "permissions",
              "type": "ui-select-multiple",
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
