'use strict';

/**
 * @ngdoc function
 * @name angularApp.controller:AppCtrl
 * @description
 * # AppCtrl
 * Controller of the angularApp
 */
angular.module('angularApp')
  .controller('AppCtrl', function ($scope, $http, $auth, $q, $state, APP, exMsg, $stateParams) {
    var vm = $scope;
    window.appCtrl = vm;
    window.$auth = $auth;
    
    vm.partials = APP.partials || {};
    vm.modules = APP.modules || {};

    // Force permissions to be loaded
    $auth.validateToken();
    
    vm.state = {
      isIndex: true,
      isNew: false,
      isShow: false,
      isView: false,
      isBulk: false,
      hideNameGrid: false,
      hideFormNav: false,
      update: function (state) {
        if (!state) return;
        
        this.isIndex = (state.name === 'app.module.model');
        this.isNew   = (state.name === 'app.module.model.new' || state.name === 'app.module.form.model');
        this.isShow  = (state.name === 'app.module.model.show');
        this.isView  = (state.name === 'app.module.model.show.view');
        this.isBulk  = (state.name === 'app.module.model.show.bulk');
        this.hideNameGrid = (this.isIndex || this.isBulk);
        this.hideFormNav = (this.isBulk);
      }
    };

    vm.drpOptions = {
      showDropdowns: true,
      ranges: {
         'Today': [moment().startOf('day'), moment().endOf('day')],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), moment().endOf('day')],
         'Last 30 Days': [moment().subtract(29, 'days'), moment().endOf('day')],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      opens: 'left',
    };

    vm.drpOptionsR = {
      showDropdowns: true,
      ranges: {
         'Today': [moment().startOf('day'), moment().endOf('day')],
         'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
         'Last 7 Days': [moment().subtract(6, 'days'), moment().endOf('day')],
         'Last 30 Days': [moment().subtract(29, 'days'), moment().endOf('day')],
         'This Month': [moment().startOf('month'), moment().endOf('month')],
         'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
      },
      opens: 'right',
    };

    vm.hasAccess = function (urlOrPermission) {
      var permission = urlOrPermission || '';
      permission = permission.replace(/-/gi, '_');

      // Guess from url if not a specific permission
      if (permission.indexOf(':') < 0) {
        permission = permission.split('?')[0];
        if (permission.indexOf('/') < 0) {
          permission = permission.classify() + ':index';
        } else {
          var regExNew  = /^([A-z-_]+)\/new/gi;
          var regExShow = /^([A-z-_]+)\/(\d+)\/show/gi;
          var regExEdit = /^([A-z-_]+)\/(\d+)\/edit/gi;

          var matchNew  = regExNew.exec(permission)
          var matchShow = regExShow.exec(permission)
          var matchEdit = regExEdit.exec(permission)

          if (matchNew) {
            permission = matchNew[1].classify() + ':create';
          } else if (matchShow) {
            permission = matchShow[1].classify() + ':show';
          } else if (matchEdit) {
            permission = matchEdit[1].classify() + ':update';
          }
        }
      }

      var found = _.find($auth.user.permissions, function (p) {
        return p === permission;
      });
      return (found === undefined)? false : true;
    }

    vm.error = function (error) {
      error = error || {};
      error.message  && exMsg.error(error.message, error.type || 'Error');
      error.messages && exMsg.errorSummary(error.messages);
    }

    vm.back = function () {
      $state.go('^');
    }

    vm.state.update(vm.state.update($state.current));

    vm.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      vm.state.update(toState);
    });

    vm.hasUrl = function(url) {
      return window.location.hash.indexOf(url) >= 0;
    };

    vm.buildQ = function(data) {
      return _.map(data, function (v, k) {
          return k + '.eq.' + v;
        }).join(':');
    };

    vm.splitQ = function(str) {
      var result = {};
      str.split(':').forEach(function(x){
        var arr = x.split('.eq.');
        arr[1] && (result[arr[0]] = arr[1]);
      });
      return result;
    };

    vm.showPasswordChange = function () {
      exMsg.sweetAlert({
        title: 'Change Password',
        text: 'Current Password:',
        type: 'input',
        inputType: 'password',
        showCancelButton: true,
        closeOnConfirm: false,
        animation: 'slide-from-top',
        inputPlaceholder: 'Current Password'
      }, function(currentPassword) {
        if (currentPassword === false) return false;
        if (currentPassword === '') {
          exMsg.sweetAlert.showInputError('No password provided!');
          return false
        }
        exMsg.sweetAlert({
          title: 'Change Password',
          text: 'New Password:',
          type: 'input',
          inputType: 'password',
          showCancelButton: true,
          closeOnConfirm: false,
          animation: 'slide-from-top',
          inputPlaceholder: 'New Password'
        }, function(password) {
          if (password === false) return false;
          if (password === '') {
            exMsg.sweetAlert.showInputError('No password provided!');
            return false
          }
          exMsg.sweetAlert({
            title: 'Change Password',
            text: 'New Password Again:',
            type: 'input',
            inputType: 'password',
            showCancelButton: true,
            closeOnConfirm: false,
            animation: 'slide-from-top',
            inputPlaceholder: 'New Password Again'
          }, function(passwordConfirmation) {
            if (passwordConfirmation === false) return false;
            if (passwordConfirmation === '') {
              exMsg.sweetAlert.showInputError('No password provided!');
              return false
            }
            $http.post(APP.apiPrefix + 'users/' + $auth.user.id + '/change_password', {
              current_password: currentPassword,
              password: password,
              password_confirmation: passwordConfirmation
            }).success(function (data) {
              if (data.error) {
                exMsg.sweetAlert(data.message, (data.messages || []).join('\n'), 'error');
              } else {
                exMsg.sweetAlert('Great!', 'Password changed successfully', 'success');
              }
            }).catch(function (data) {
              exMsg.sweetAlert('Nice!', 'You wrote: ' + inputValue, 'error');
            });
          })
        });
      });
    }
  });
