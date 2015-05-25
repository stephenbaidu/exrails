'use strict';

describe('Controller: UiCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var UiCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    UiCtrl = $controller('UiCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
