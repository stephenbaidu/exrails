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
      indexGridName: 'app/partials/index-grid-name.html',
      indexGridNoLink: 'app/partials/index-grid-no-link.html',
      indexGridPopUp: 'app/partials/index-grid-pop-up.html',
      loadMoreButton: 'app/partials/load-more-button.html',
      formlyForm: 'app/partials/formly-form.html',
      formNewButtons: 'app/partials/form-new-buttons.html',
      formShowButtons: 'app/partials/form-show-buttons.html',
      formEditButtons: 'app/partials/form-edit-buttons.html',
      bulkNav: 'app/partials/bulk-nav.html',
      bulkGrid: 'app/partials/bulk-grid.html',
      uploadsGrid: 'app/partials/uploads-grid.html',
      closeButton: 'app/partials/close-button.html'
    }
  });