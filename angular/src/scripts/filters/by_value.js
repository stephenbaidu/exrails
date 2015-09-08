'use strict';

/**
 * @ngdoc filter
 * @name angularApp.filter:byValue
 * @function
 * @description
 * # byValue
 * Filter in the angularApp.
 */
angular.module('angularApp')
  .filter('byValue', function () {
    return function (arr, value) {
      var i = 0, len = arr.length;
      for (; i < len; i++) {
        if (+arr[i].value == +value) {
          return arr[i];
        }
      }
      return {};
    };
  });
