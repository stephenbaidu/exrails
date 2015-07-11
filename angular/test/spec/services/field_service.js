'use strict';

describe('Service: fieldService', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var fieldService;
  beforeEach(inject(function (_fieldService_) {
    fieldService = _fieldService_;
  }));

  it('should do something', function () {
    expect(!!fieldService).toBe(true);
  });

});
