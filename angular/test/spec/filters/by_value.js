'use strict';

describe('Filter: byValue', function () {

  // load the filter's module
  beforeEach(module('angularApp'));

  // initialize a new instance of the filter before each test
  var byValue;
  beforeEach(inject(function ($filter) {
    byValue = $filter('byValue');
  }));

  it('should return the input prefixed with "byValue filter:"', function () {
    var text = 'angularjs';
    expect(byValue(text)).toBe('byValue filter: ' + text);
  });

});
