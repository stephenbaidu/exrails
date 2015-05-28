'use strict';

/**
 * @ngdoc service
 * @name angularApp.exMsgBox
 * @description
 * # exMsgBox
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('exMsgBox', function ($q) {
    return {
      notify: function(options) {
        new PNotify(options);
      },
      success: function(message, title) {
        new PNotify({
          title: title || 'Success',
          text:  message,
          type: 'success',
          nonblock: true,
          nonblock_opacity: .2
        });
      },
      error: function(message, title) {
        new PNotify({
          title: title || 'Error',
          text:  message,
          type: 'error',
          nonblock: true,
          nonblock_opacity: .2
        });
      },
      notice: function(message, title) {
        // title will not be used but available
        new PNotify({
          text: message,
          type: 'notice',
          nonblock: true,
          nonblock_opacity: .5
        });
      },
      info: function (message, title) {
        new PNotify({
          title: title || 'Info',
          text: message,
          addclass: 'custom',
          opacity: .8,
          nonblock: true,
          nonblock_opacity: .2
        });
      },
      errorSummary: function(messages) {
        var message = '<ul>';
        angular.forEach(messages, function(value){
          message += '<li>' + value + '</li>';
        });
        message += '</ul>';
        new PNotify({
          title: 'Error Summary',
          text:  message,
          type: 'error',
          hide: false
        });
      },
      confirm: function(message, title) {
        var d = $q.defer();

        (new PNotify({
          title: title || 'Confirmation Needed',
          text: message,
          icon: 'glyphicon glyphicon-question-sign',
          hide: false,
          confirm: {
            confirm: true
          },
          buttons: {
            closer: false,
            sticker: false
          },
          history: {
            history: false
          }
        })).get().on('pnotify.confirm', function() {
          d.resolve(true);
        }).on('pnotify.cancel', function() {
          d.reject(false);
        });

        return d.promise;
      },
      clear: function () {
        PNotify.removeAll();
      },
      sweetAlert: function(options) {
        sweetAlert(options);
      },
      prompt: function(message, title) {
        var d = $q.defer()
        sweetAlert({
          title: title || 'Input Needed',
          text: message,
          type: 'input',
          showCancelButton: true,
          animation: "slide-from-top"
        }, function (inputValue) {
          if (inputValue === false) {
            d.reject(false);
            return false;
          } else {
            d.resolve(inputValue);
            return true;
          }
        });

        return d.promise;
      }
    };
  });
