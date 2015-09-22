// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-06-30 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/underscore/underscore.js',
      'bower_components/lodash/lodash.js',
      'bower_components/bootstrap-sass-official/vendor/assets/javascripts/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-aria/angular-aria.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-underscore/angular-underscore.js',
      'bower_components/angular-cookie/angular-cookie.js',
      'bower_components/ng-token-auth/dist/ng-token-auth.js',
      'bower_components/jspdf/dist/jspdf.min.js',
      'bower_components/jspdf-autotable/jspdf.plugin.autotable.js',
      'bower_components/pnotify/pnotify.core.js',
      'bower_components/pnotify/pnotify.buttons.js',
      'bower_components/pnotify/pnotify.callbacks.js',
      'bower_components/pnotify/pnotify.confirm.js',
      'bower_components/pnotify/pnotify.desktop.js',
      'bower_components/pnotify/pnotify.history.js',
      'bower_components/pnotify/pnotify.nonblock.js',
      'bower_components/sweetalert/dist/sweetalert.min.js',
      'bower_components/angular-xeditable/dist/js/xeditable.js',
      'bower_components/angular-loading-bar/build/loading-bar.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/moment/moment.js',
      'bower_components/bootstrap-daterangepicker/daterangepicker.js',
      'bower_components/angular-daterangepicker/js/angular-daterangepicker.js',
      'bower_components/angular-ui-select/dist/select.js',
      'bower_components/jasny-bootstrap/dist/js/jasny-bootstrap.js',
      'bower_components/bootstrap-datepicker/js/bootstrap-datepicker.js',
      'bower_components/api-check/dist/api-check.js',
      'bower_components/angular-formly/dist/formly.js',
      'bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
      'bower_components/ngDialog/js/ngDialog.js',
      'bower_components/ng-mfb/src/mfb-directive.js',
      'bower_components/Chart.js/Chart.js',
      'bower_components/angular-chart.js/dist/angular-chart.js',
      'bower_components/angular-file-upload/dist/angular-file-upload.min.js',
      'bower_components/jszip/dist/jszip.js',
      'bower_components/js-xlsx/dist/xlsx.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "src/scripts/**/*.js",
      "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'
  });
};
