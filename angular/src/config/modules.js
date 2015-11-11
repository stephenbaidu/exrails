angular.module('angularApp')
  .run(function run(APP) {
    APP.modules = {
      main: [
        { text: 'Users', url: 'users', icon: 'fa fa-users color-deep-purple-300' },
        { text: 'Roles', url: 'roles', icon: 'glyphicon glyphicon-user color-red-100' },
        { text: 'UserForm', url: 'form/roles', icon: 'fa fa-user color-teal-500' }
      ],
      admin: [
        { text: 'Users', url: 'users', icon: 'fa fa-briefcase color-deep-purple-300' },
        { text: 'Roles', url: 'roles', icon: 'fa fa-user color-red-100' }
      ],
      reports: [
        { text: 'User',  url: 'user_info', icon: 'fa fa-files-o color-teal-500' },
        { text: 'Users', url: 'users',     icon: 'fa fa-clipboard color-blue-grey-500' },
        { text: 'Roles', url: 'roles',     icon: 'fa fa-clipboard' }
      ]
    };
  });
