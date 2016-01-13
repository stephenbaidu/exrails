'use strict';

/**
 * @ngdoc filter
 * @name uixApp.filter:lookup
 * @function
 * @description
 * # lookup
 * Filter in the uixApp.
 */
angular.module('uixApp')
  .filter('lookup', function (lookupService) {
    return function (value, modelName, returnAsArray) {
      var ids = _.isArray(value)? value : [value];
      var arr = lookupService.get(modelName);
      var vals = _.pluck(_.filter(arr, function (obj) {
        return _.contains(ids, obj.value);
      }), 'name');
      
      if (returnAsArray) {
        return vals;
      } else {
        return vals.join(', ');
      }
    };
  });
