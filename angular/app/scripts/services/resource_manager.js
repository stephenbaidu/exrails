'use strict';

/**
 * @ngdoc service
 * @name angularApp.resourceManager
 * @description
 * # resourceManager
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('resourceManager', function ($q, $http, $resource) {

    var resMgr = {
      models: {}
    };
    
    resMgr.getName = function(model) {
      model = model.replace(/-/gi, '_');
      model = model.underscore().split('_');
      model = model.slice(0, model.length - 1).join('_').camelize() + model[model.length - 1].classify();
      
      return model;
    };

    resMgr.getUrl = function(model) {
      model = model.underscore().split('_');
      model = model.slice(0, model.length - 1).join('_').camelize() + model[model.length - 1].pluralize().camelize();
      
      return model.underscore();
    };

    resMgr.getModel = function (model, config) {
      config = config || {};
      config.name = model = this.getName(model);
      
      if(!config.url) config.url     = this.getUrl(model);
      if(!config.key) config.key     = model.underscore();
      if(!config.title) config.title = config.url.titleize();
      
      return config;
    };

    resMgr.register = function (model, apiUrl, params, config) {
      model = this.getName(model);
      params = params || {id: '@id'};
      config = config || {};
      
      if(!this.models[model]) {
        var klass = $resource(apiUrl, params, {
          query:  { method: 'GET', isArray: true },
          update: { method: 'PUT' }
        });
        app.factory(model, function () {
          return klass;
        });
        this.models[model] = this.getModel(model, config);
        this.models[model]['apiUrl'] = apiUrl;
        this.models[model]['klass'] = klass;
      }
      
      return this.models[model];
    };

    resMgr.query = function (model, data, callback) {
      var d = $q.defer(); model = this.getName(model);
      
      this.models[model]['klass'].query(data, function (response, headers) {
        if(response.error || response.errors) {
          d.reject(response);
        } else {
          d.resolve(response);
        }
        callback && callback(response, headers('_meta_total'));
      }, function (response) { d.reject(response) })
      .$promise.catch(function (error) {
        window.error = error;
        d.reject({message: 'Sorry, you do not have permission.'});
      });
      
      return d.promise;
    };

    resMgr.get = function (model, data, callback) {
      var d = $q.defer(); model = this.getName(model);
      
      this.models[model]['klass'].get(data, function (response, headers) {
        response.error? d.reject(response) : d.resolve(response);
        callback && callback(response);
      }, function (response) { console.log(response) });
      
      return d.promise;
    };

    resMgr.create = function (model, data, callback) {
      var d = $q.defer(); model = this.getName(model);
      
      new this.models[model]['klass'](data).$save(function (response) {
        response.error? d.reject(response) : d.resolve(response);
        callback && callback(response);
      }, function (response) { console.log(response) });
      
      return d.promise;
    };

    resMgr.update = function (model, data, callback) {
      var d = $q.defer(); model = this.getName(model);
      
      new this.models[model]['klass'](data).$update(function (response) {
        response.error? d.reject(response) : d.resolve(response);
        callback && callback(response);
      }, function (response) { console.log(response) });
      
      return d.promise;
    };

    resMgr.delete = function (model, data, callback) {
      var d = $q.defer(); model = this.getName(model);
      
      new this.models[model]['klass'](data).$delete(function (response) {
        response.error? d.reject(response) : d.resolve(response);
        callback && callback(response);
      }, function (response) { console.log(response) });
      
      return d.promise;
    };

    return resMgr;
  });
