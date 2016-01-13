'use strict';

/**
 * @ngdoc filter
 * @name uixApp.filter:byId
 * @function
 * @description
 * # byId
 * Filter in the uixApp.
 */
angular.module('uixApp')
  .filter('byId', function () {
    return function(input, id) {
      var i = 0, len = input.length;
      for (; i < len; i++) {
        //convert both ids to numbers to be sure
        if (+input[i].id == +id) {
          return input[i];
        }
      }
      return {};
    }
  });
