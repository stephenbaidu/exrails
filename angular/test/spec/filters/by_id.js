'use strict';

describe('Filter: byId', function () {

  // load the filter's module
  beforeEach(module('angularApp'));

  // initialize a new instance of the filter before each test
  var byId;
  beforeEach(inject(function ($filter) {
    byId = $filter('byId');
  }));

  it('should return the input prefixed with "byId filter:"', function () {
    var text = 'angularjs';
    expect(byId(text)).toBe('byId filter: ' + text);
  });

});
