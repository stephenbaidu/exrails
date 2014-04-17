var app = angular.module("app");

app.filter('filterById', function() {
  return function(input, id) {
    var i = 0, len = input.length;
    for (; i < len; i++) {
      //convert both ids to numbers to be sure
      if (+input[i].id == +id) {
        return input[i];
      }
    }
    return {};
  }
});