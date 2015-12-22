
angular.module('angularApp')
  .run(function run(APP) {
    APP.setModule('reports', {
      title: 'Reports',
      icon: 'fa fa-bar-chart', 
      links: links(),
      hasAccess: hasAccess
    });
    
    function links () {
      return [
        { text: 'User',  url: 'user_info', icon: 'fa fa-files-o color-teal-700' },
        { text: 'Users', url: 'users',     icon: 'fa fa-leanpub color-green-800' },
        { text: 'Roles', url: 'roles',     icon: 'fa fa-shekel color-blue-700' }
      ];
    }

    function hasAccess (user) {
      return true;
    }
  });
