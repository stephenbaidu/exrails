'use strict';

describe('Controller: ModuleCtrl', function () {

  // load the controller's module
  beforeEach(module('angularApp'));

  var ModuleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ModuleCtrl = $controller('ModuleCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});