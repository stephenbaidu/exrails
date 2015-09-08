
angular.module("angularApp")
  .factory("XLSXReaderService", function ($q, $rootScope) {
    var service = function (data) {
      angular.extend(this, data);
    };

    service.readFile = function (file, readCells, toJSON) {
      var deferred = $q.defer();

      XLSXReader(file, readCells, toJSON, function (data) {
        $rootScope.$apply(function () {
          deferred.resolve(data);
        });
      });

      return deferred.promise;
    };
    return service;
});