'use strict';

/**
 * @ngdoc service
 * @name angularApp.formService
 * @description
 * # formService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('formService', function () {
    var forms = {};

    var formSVC = {
      get: function (modelInSnakeCase) {
        return forms[modelInSnakeCase] || [];
      }
    };


forms['role'] = [
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

forms['sample'] = [
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
            "key": "description",
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
        "htmlClass": "col-sm-6 col-xs-12",
        "items": [
          {
            "key": "sample_date",
            "fieldHtmlClass": "input-lg",
            "type": "datepicker",
            "pickadate": {
              "selectYears": true,
              "selectMonths": true
            }
          }
        ]
      },
      {
        "type": "section",
        "htmlClass": "col-sm-6 col-xs-12",
        "items": [
          {
            "key": "sample_status_id",
            "fieldHtmlClass": "input-lg selectpicker",
            "lookup": "sample_status"
          }
        ]
      }
    ]
  }
];

forms['sample_status'] = [
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
      }
    ]
  }
];

    return formSVC;
  });
