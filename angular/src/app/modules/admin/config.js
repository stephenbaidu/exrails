
angular.module('angularApp')
  .run(function run(APP) {
    APP.setModule('admin', {
      title: 'Admin Panel',
      icon: 'fa fa-cogs',
      links: links(),
      hasAccess: hasAccess
    });

    function links () {
      return [
        { text: 'Users', url: 'users', icon: 'fa fa-briefcase color-deep-purple-300' },
        { text: 'Roles', url: 'roles', icon: 'fa fa-user color-red-100' }
      ];
    }

    function hasAccess (user) {
      return true;
    }
  });