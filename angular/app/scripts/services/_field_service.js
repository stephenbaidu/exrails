'use strict';

/**
 * @ngdoc service
 * @name angularApp.fieldService
 * @description
 * # fieldService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('fieldService', function () {
    var fields = {};

    var fieldSVC = {
      get: function (modelInSnakeCase) {
        return fields[modelInSnakeCase] || [];
      }
    };


fields['role'] = [
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
        "key": "permissions",
        "type": "input",
        "templateOptions": {
          "required": false,
          "label": "Permissions"
        }
      }
    ]
  },
  {
    "fieldGroup": [
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
  }
];

fields['sample'] = [
  {
    "fieldGroup": [
      {
        "className": "col-xs-6",
        "key": "name",
        "type": "input",
        "templateOptions": {
          "required": false,
          "label": "Name"
        }
      },
      {
        "className": "col-xs-6",
        "key": "description",
        "type": "input",
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
        "className": "col-xs-6",
        "key": "sample_date",
        "type": "datepicker",
        "templateOptions": {
          "required": false,
          "label": "Sample Date"
        }
      },
      {
        "className": "col-xs-6",
        "key": "sample_status_id",
        "type": "ui-select",
        "templateOptions": {
          "required": false,
          "label": "Sample Status",
          "lookup": "sample_status",
          "valueProp": "value",
          "labelProp": "name",
          "options": [

          ]
        },
        "controller": /* @ngInject */ function($scope, lookupService) {
          lookupService.load('sample').then(function() {
            $scope.to.options = lookupService.get('sample', $scope.to.lookup);
          });
        }

      }
    ]
  }
];

fields['sample_status'] = [
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
      }
    ]
  }
];

    return fieldSVC;
  });
