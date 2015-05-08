'use strict';

describe('Service: resourceManager', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var resourceManager;
  beforeEach(inject(function (_resourceManager_) {
    resourceManager = _resourceManager_;
  }));

  it('should do something', function () {
    expect(!!resourceManager).toBe(true);
  });

});
