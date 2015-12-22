
angular.module('angularApp')
  .run(function run(APP) {
    APP.setModule('main', {
      title: 'Home',
      icon: 'fa fa-home',
      links: links(),
      hasAccess: hasAccess
    });
    
    function links () {
      return [
        { text: 'Users', url: 'users', icon: 'fa fa-users color-deep-purple-300' },
        { text: 'Roles', url: 'roles', icon: 'glyphicon glyphicon-user color-red-100' },
        { text: 'UserForm', url: 'form/roles', icon: 'fa fa-user color-teal-500' }
      ];
    }

    function hasAccess (user) {
      return true;
    }
  });
