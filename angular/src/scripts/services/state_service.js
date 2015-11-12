'use strict';

/**
 * @ngdoc service
 * @name angularApp.stateService
 * @description
 * # stateService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('stateService', function ($rootScope, $state, $uibModalStack) {
    var stateSVC = {
      isIndex: true,
      isNew: false,
      isNewPop: false,
      isShow: false,
      isShowPop: false,
      isView: false,
      isBulk: false,
      showIndex: true,
      hideNameGrid: false,
      update: function (state) {
        if (!state) return;
        
        this.isIndex   = (state.name === 'app.module.model');
        this.isNew     = (state.name === 'app.module.model.new' || state.name === 'app.module.form.model');
        this.isNewPop  = (state.name === 'app.module.model.newPop');
        this.isShow    = (state.name === 'app.module.model.show');
        this.isShowPop = (state.name === 'app.module.model.showPop');
        this.isView    = (state.name === 'app.module.model.view');
        this.isBulk    = (state.name === 'app.module.model.bulk');
        this.showIndex    = (this.isIndex || this.isNewPop || this.isShowPop);
        this.hideNameGrid = (this.showIndex || this.isBulk);
      }
    };

    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      stateSVC.update(toState);
    });

    stateSVC.update($state.current);
    
    return stateSVC;
  });