'use strict';

/**
 * @ngdoc function
 * @name uixApp.controller:CalendarCtrl
 * @description
 * # CalendarCtrl
 * Controller of the uixApp
 */
angular.module('uixApp')
  .controller('CalendarCtrl', function (APP, $http) {
    var vm = this;

    vm.routeName = null;

    // Initial calender values
    vm.view = 'month';
    vm.events = [];
    vm.viewDate = new Date();
    vm.viewTitle = '';

    vm.initRoute = function (routeName, options) {
      vm.routeName = routeName;
      options = options || {};

      if (options.view) {
        vm.view = options.view;
      }
      
      vm.reload();
    }

    vm.reload = function () {
      $http.get(APP.apiPrefix + 'dashboard/' + vm.routeName)
        .success(function (data) {
          vm.events = _.map(data, function (e) {
            // e.startsAt = moment(e.startsAt).toDate();
            // e.endsAt = moment(e.endsAt).toDate();
            e.incrementsBadgeTotal = false;
            return e;
          });
        });
    }
  });
