'use strict';

describe('Controller: NgTokenAuthEventsCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var NgTokenAuthEventsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NgTokenAuthEventsCtrl = $controller('NgTokenAuthEventsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
