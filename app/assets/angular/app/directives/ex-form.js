angular.module("app").directive("exForm", ['$compile', function ($compile) {
  var linkFn = function (scope, element, attrs, ctrl) {
    scope.columns = scope.columns || [];
    scope.noOfCols  = (attrs['noOfCols'] || 3);

    var tpls = {
      lookup:          '<div style="width: <%= width %>" class="input-group input-group-sm select2-bootstrap-prepend"><span class="input-group-addon"><span class="glyphicon glyphicon-th-list"></span></span><select <%= attributes %> ui-select2="{allowClear_: true}" ng-disabled="<%= disabled %>" class="form-control input-sm select2" id="record_<%= name %>" ng-model="ngModel.<%= name %>"><option></option><option ng-repeat="l in lookup_<%= lookup %>" value="{{ l.id }}"> {{ l.name }} </option></select></div>',
      lookup_text:     '<div style="width: <%= width %>" class="input-group input-group-sm select2-bootstrap-prepend"><span class="input-group-addon"><span class="glyphicon glyphicon-th-list"></span></span><select <%= attributes %> ui-select2="{allowClear_: true}" ng-disabled="<%= disabled %>" class="form-control input-sm select2" id="record_<%= name %>" ng-model="ngModel.<%= name %>"><option></option><option ng-repeat="l in lookup_<%= lookup %>" value="{{ l.name }}"> {{ l.name }} </option></select></div>',
      bs_switch:       '<br> <bs-switch switch-type="checkbox" switch-size="" switch-animate="true" switch-icon="check" switch-on-label="Yes" switch-off-label="No" switch-on="default" id="record_<%= name %>" ng-model="ngModel.<%= name %>"/>',
      number_input:    '<div style="width: <%= width %>" class="input-group input-group-sm"><span class="input-group-addon"><span class="glyphicon glyphicon-plus-sign"></span></span><input type="text" ng-disabled="<%= disabled %>" class="form-control" id="record_<%= name %>" ng-model="ngModel.<%= name %>"/></div>',
      date_picker:     '<div style="width: <%= width %>" class="input-group input-group-sm"><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span><input type="text" ng-click="datepicker_clicked($event)" is-open="datepicker_opened[\'record_<%= name %>\']" datepicker-popup="dd-MMM-yyyy" ng-disabled="<%= disabled %>" class="form-control"show-weeks="false" datepicker-append-to-body="true" id="record_<%= name %>" ng-model="ngModel.<%= name %>"/></div>',
      time_picker:     '<div style="width: <%= width %>" class="input-group input-group-sm bootstrap-timepicker"><span class="input-group-addon"><span class="glyphicon glyphicon-time"></span></span><div class="dropdown-menu pull-right" style="padding: 0px 8px 0px 8px;"><div ng-model="ngModel.<%= name %>" style="display:inline-block;" ng-click="timepicker_clicked($event)"><timepicker hour-step="1" minute-step="15" show-meridian="true"></timepicker></div></div><input type="text" mo-format="hh : mm a" ng-disabled="<%= disabled %>" class="form-control dropdown-toggle" data-toggle="dropdown" id="record_<%= name %>" ng-model="ngModel.<%= name %>"/></div>',
      datetime_picker: '<div style="width: <%= width %>" class="input-group input-group-sm"><span class="input-group-addon"><span class="glyphicon glyphicon-calendar"></span></span><input type="text" ng-click="datepicker_clicked($event)" is-open="datepicker_opened[\'record_<%= name %>\']" style="width: 50%" datepicker-popup="dd-MMM-yyyy" ng-disabled="<%= disabled %>" class="form-control" show-weeks="false" datepicker-append-to-body="true" id="record_<%= name %>" ng-model="ngModel.<%= name %>"/><div class="dropdown-menu pull-right" style="padding: 0px 8px 0px 8px;"><div ng-model="ngModel.<%= name %>" style="display:inline-block;" ng-click="timepicker_clicked($event)"><timepicker hour-step="1" minute-step="15" show-meridian="true"></timepicker></div></div><input type="text" mo-format="hh : mm a" style="width: 35%" ng-disabled="<%= disabled %>" class="form-control dropdown-toggle" data-toggle="dropdown" id="record_<%= name %>" ng-model="ngModel.<%= name %>"/></div>',
      password_input:  '<div style="width: <%= width %>" class="input-group input-group-sm"><span class="input-group-addon"><span class="glyphicon glyphicon-unchecked"></span></span><input type="password" ng-disabled="<%= disabled %>" class="form-control" id="record_<%= name %>" ng-model="ngModel.<%= name %>"/></div>',
      text_input:      '<div style="width: <%= width %>" class="input-group input-group-sm"><span class="input-group-addon"><span class="glyphicon glyphicon-unchecked"></span></span><input type="text" ng-disabled="<%= disabled %>" class="form-control" id="record_<%= name %>" ng-model="ngModel.<%= name %>"/></div>'
    }

    var type_tpl = {
      _boolean:  'bs_switch',
      _integer:  'number_input',
      _decimal:  'number_input',
      _float:    'number_input',
      _date:     'date_picker',
      _time:     'time_picker',
      _datetime: 'datetime_picker',
      _password: 'password_input'
    }

    var type_width = {
      _integer:  '40%',
      _decimal:  '50%',
      _float:    '50%',
      _date:     '50%',
      _time:     '40%',
      _datetime: '80%',
      _password: '90%'
    }
    
    function updateView() {
      var html = "", tpl = "", col_data = {};

      html += '<form class="" role="form">';
      
      _.each(scope.columns, function(column, key) {
        if(column.type == 'blank' && scope.noOfCols == 1) {
          return;
        } else if(column.type == 'blank') {
          html += '<div class="form-group col-md-4">&nbsp;</div>';
          return;
        }
        
        if(scope.noOfCols == 1)
          html += '<div class="form-group col-md-12">';
        else if(scope.noOfCols == 2)
          html += '<div class="form-group col-md-6">';
        else
          html += '<div class="form-group col-md-4">';

        html += '  <label for="record_' + column.name + '" class="control-label">';
        html +=      column.label;
        html += '  </label>';

        col_data = {
          width: '90%',
          name: column['name'],
          attributes: column['attributes'],
          lookup: column['lookup'],
          disabled: (attrs['disabled'] || column['disabled'])
        };
        tpl = "text_input";

        if(column['lookup']) {
          col_data['width'] = '90%';
          tpl = (column.type == 'integer')? "lookup" : "lookup_text";
        } else if(type_tpl['_' + column.type]) {
          col_data['width'] = type_width['_' + column.type];
          tpl = type_tpl['_' + column.type];
        }

        if(scope.noOfCols == 1)
          col_data['width'] = '95%';

        html += _.template(tpls[tpl], col_data);

        html += '</div>';
      });

      html += '</form>';

      element.html(html); window.exFormHtml = html;
      $compile(element.contents())(scope);
    }

    scope.$watch('columns', function () {
      updateView();
    }, true);
  };

  var controllerFn = ['$scope', '$element', function($scope, $element) {
    $scope.datepicker_opened = {}

    $scope.datepicker_clicked = function(e) {
      e.preventDefault();
      e.stopPropagation();
      $scope.datepicker_opened[e.target.id] = true
    }

    $scope.timepicker_clicked = function(e) {
      e.preventDefault();
      e.stopPropagation();
    };

    $scope.$watch('lookups', function () {
      angular.forEach($scope.lookups, function(value, key) {
        $scope['lookup_' + key] = value;
      });
    }, true);
    
  }];

  return {
    restrict: 'E',
    scope: {
      columns: "=",
      ngModel: "=",
      lookups: "="
    },
    replace: true,
    link: linkFn,
    controller: controllerFn
  };
}]);
