'use strict';

/**
 * @ngdoc directive
 * @name angularApp.ngFile
 * @description
 * # ngFile
 * ngModel-like implementation for input type file.
 */
angular.module('angularApp').directive("ngFile", function () {
  return {
    scope: {
      ngFile: "="
    },
    link: function (scope, element, attributes) {
      element.bind("change", function (changeEvent) {
        scope.$apply(function () {
          if ('multiple' in attributes) {
            scope.ngFile = changeEvent.target.files;
          } else {
            scope.ngFile = changeEvent.target.files[0];
          }
        });
      });
    }
  }
});
