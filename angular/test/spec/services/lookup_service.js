'use strict';

describe('Service: lookupService', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var lookupService;
  beforeEach(inject(function (_lookupService_) {
    lookupService = _lookupService_;
  }));

  it('should do something', function () {
    expect(!!lookupService).toBe(true);
  });

});
