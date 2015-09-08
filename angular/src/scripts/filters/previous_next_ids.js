'use strict';

/**
 * @ngdoc filter
 * @name angularApp.filter:getById
 * @function
 * @description
 * # getById
 * Filter in the angularApp.
 */
angular.module('angularApp')
  .filter('previousNextIds', function () {
    return function(input, id) {
      var result = { previousId: 0, nextId: 0 };
      var i = 0, len = input.length;
      for (; i < len; i++) {
        //convert both ids to numbers to be sure
        if (+input[i].id == +id) {
          if (i > 0) {
            result.previousId = input[i - 1].id;
          }

          if (i < len - 1) {
            result.nextId = input[i + 1].id;
          }
          
          return result;
        }
      }
      return result;
    }
  });
