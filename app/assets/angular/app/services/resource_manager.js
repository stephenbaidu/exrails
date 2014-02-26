var app = angular.module("app");

app.service("ResMgr", ['$q', '$http', function ($q, $http) {
  return {
    models: {},
    getName: function(model) {
      model = model.replace('-', '_');
      model = model.underscore().split('_');
      model = model.slice(0, model.length - 1).join('_').camelize() + model[model.length - 1].classify();
      return model;
    },
    getUrl: function(model) {
      model = model.underscore().split('_');
      model = model.slice(0, model.length - 1).join('_').camelize() + model[model.length - 1].pluralize().camelize();
      return model.underscore();
    },
    getModel: function (model, config) {
      config = config || {};
      config.name = model = this.getName(model);
      if(!config.url) config.url           = this.getUrl(model);
      if(!config.key) config.key           = model.underscore();
      if(!config.display)  config.display  = model.underscore().titleize();
      if(!config.displays) config.displays = config.url.titleize();
      return config;
    },
    register: function (model, api_url, params, config) {
      model = this.getName(model);
      params = params || {id: '@id'};
      config = config || {};
      if(!this.models[model]) {
        app.factory(model, ['$resource', function ($resource) {
          return $resource(api_url, params, {
            update: { method: 'PUT' }
          });
        }]);
        this.models[model] = this.getModel(model, config);
        this.models[model]["api_url"] = api_url;
        this.models[model]["klass"] = angular.injector(['ng', 'app']).get(model);
      }
      return this.models[model];
    },
    query: function (model, data, callback) {
      return this.get(model, data, callback);
    },
    get: function (model, data, callback) {
      var d = $q.defer();
      model = this.getName(model);
      this.models[model]["klass"].get(data, function (res) {
        res.success? d.resolve(res) : d.reject(res);
        callback && callback(res);
      });
      return d.promise;
    },
    create: function (model, data, callback) {
      var d = $q.defer();
      model = this.getName(model);
      new this.models[model]["klass"](data).$save(function (res) {
        res.success? d.resolve(res) : d.reject(res);
        callback && callback(res);
      });
      return d.promise;
    },
    update: function (model, data, callback) {
      var d = $q.defer();
      model = this.getName(model);
      new this.models[model]["klass"](data).$update(function (res) {
        res.success? d.resolve(res) : d.reject(res);
        callback && callback(res);
      });
      return d.promise;
    },
    delete: function (model, data, callback) {
      var d = $q.defer();
      model = this.getName(model);
      new this.models[model]["klass"](data).$delete(function (res) {
        res.success? d.resolve(res) : d.reject(res);
        callback && callback(res);
      });
      return d.promise;
    }
  };
}]);
