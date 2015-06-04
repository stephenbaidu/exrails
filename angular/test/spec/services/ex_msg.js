'use strict';

describe('Service: exMsg', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var exMsg;
  beforeEach(inject(function (_exMsg_) {
    exMsg = _exMsg_;
  }));

  it('should do something', function () {
    expect(!!exMsg).toBe(true);
  });

});
