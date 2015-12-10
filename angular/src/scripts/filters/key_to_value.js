'use strict';

/**
 * @ngdoc filter
 * @name angularApp.filter:keyToValue
 * @function
 * @description
 * # keyToValue
 * Filter in the angularApp.
 */
angular.module('angularApp')
  .filter('keyToValue', function (lookupService) {
    return function (value, data) {
      return data[value];
    };
  });
