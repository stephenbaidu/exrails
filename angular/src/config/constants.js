angular.module('angularApp')
  .constant('APP', {
    root: '/',
    apiPrefix: '/api/',
    partials: {
      fab: 'app/partials/floating-action-button.html',
      filterInput: 'app/partials/filter-input.html',
      header: 'app/partials/header.html',
      searchForm: 'app/partials/search-form.html',
      indexGrid: 'app/partials/index-grid.html',
      nameGrid: 'app/partials/name-grid.html',
      loadMoreButton: 'app/partials/load-more-button.html',
      formNav: 'app/partials/form-nav.html',
      formlyForm: 'app/partials/formly-form.html',
      formNewButtons: 'app/partials/form-new-buttons.html',
      formShowButtons: 'app/partials/form-show-buttons.html',
      formEditButtons: 'app/partials/form-edit-buttons.html',
      bulkNav: 'app/partials/bulk-nav.html',
      bulkGrid: 'app/partials/bulk-grid.html',
      uploadsGrid: 'app/partials/uploads-grid.html'
    },
    modules: {
      main: [
        { text: 'Users', url: 'users', icon: 'fa fa-users color-deep-purple-300' },
        { text: 'Roles', url: 'roles', icon: 'glyphicon glyphicon-user color-red-100' },
        { text: 'UserForm', url: 'form/users', icon: 'fa fa-user color-teal-500' }
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
    }
  });