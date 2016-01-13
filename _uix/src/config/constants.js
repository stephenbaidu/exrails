angular.module('uixApp')
  .constant('APP', {
    root: '/',
    apiPrefix: '/api/',
    partials: {
      fab: 'app/partials/floating-action-button.html',
      filterInput: 'app/partials/filter-input.html',
      header: 'app/partials/header.html',
      searchForm: 'app/partials/search-form.html',
      indexGrid: 'app/partials/index-grid.html',
      loadMoreButton: 'app/partials/load-more-button.html',
      formlyForm: 'app/partials/formly-form.html',
      formNewButtons: 'app/partials/form-new-buttons.html',
      formShowButtons: 'app/partials/form-show-buttons.html',
      formEditButtons: 'app/partials/form-edit-buttons.html',
      bulkNav: 'app/partials/bulk-nav.html',
      bulkGrid: 'app/partials/bulk-grid.html',
      uploadsGrid: 'app/partials/uploads-grid.html',
      closeButton: 'app/partials/close-button.html'
    },
    modules: {},
    setModule: function (moduleName, options) {
      this.modules[moduleName] = {
        name: moduleName,
        title: options.title || _.startCase(moduleName),
        icon: options.icon || 'fa fa-home',
        links: options.links || [],
        hasAccess: options.hasAccess || function () { return true; }
      }
    }
  });