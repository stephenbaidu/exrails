'use strict';

describe('Service: exMsgBox', function () {

  // load the service's module
  beforeEach(module('angularApp'));

  // instantiate service
  var exMsgBox;
  beforeEach(inject(function (_exMsgBox_) {
    exMsgBox = _exMsgBox_;
  }));

  it('should do something', function () {
    expect(!!exMsgBox).toBe(true);
  });

});
