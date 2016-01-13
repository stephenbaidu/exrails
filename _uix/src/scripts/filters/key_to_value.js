'use strict';

/**
 * @ngdoc filter
 * @name uixApp.filter:keyToValue
 * @function
 * @description
 * # keyToValue
 * Filter in the uixApp.
 */
angular.module('uixApp')
  .filter('keyToValue', function (lookupService) {
    return function (value, data) {
      return data[value];
    };
  });
