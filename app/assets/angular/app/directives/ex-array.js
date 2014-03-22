angular.module("app").directive("exArray", ['$compile', '$sce', function ($compile, $sce) {
  var linkFn = function (scope, element, attrs, ctrl) {
    scope.ngModel = scope.ngModel || [];
    scope.columns = scope.columns || [];
    scope.title   = attrs.title || "";

    scope.isViewOnly = function () {
      return (attrs.typeView != undefined);
    }

    scope.bindHtml = function (val) {
      return $sce.trustAsHtml(val);
    };

    function inputEditor(column) {
      var html = "", tpl = "";
      if(column['lookup']) {
        tpl = '<select ui-select2="{}" class="form-control input-sm select2" ng-model="item.<%= name %>"><option ng-repeat="l in lookup_<%= lookup %>" value="{{ l.id }}"> {{ l.name }} </option></select>';
        // tpl = '<select ui-select2 class="form-control input-sm select2" ng-model="item.<%= name %>" ng-options="l.name for l in lookup_<%= lookup %>"><option value=""></option></select>';
        html = _.template(tpl, { name: column.name, lookup: column['lookup'] });
      } else {
        tpl = '<input type="text" class="form-control input-sm" ng-model="item.<%= name %>"/>';
        html = _.template(tpl, { name: column.name });
      }
      return html;
    }

    function getFilter(column) {
      var type_filters = {
        "date": " | date",
        "time": " | date:'shortTime'",
        "datetime": " | date:'medium'",
        "money": " | number:'2'",
        "decimal3": " | number:'3'",
        "decimal4": " | number:'4'"
      };
      return (type_filters[column.type] || "");
    }

    function getButtons() {
      var html = "";
      html += '<a href="" ng-show="editorEnabled($index)" ng-click="saveEdit()"><i class="glyphicon glyphicon-ok"></i></a>&nbsp;&nbsp;';
      html += '<a href="" ng-show="editorEnabled($index)" ng-click="cancelEdit()"><i class="glyphicon glyphicon-remove"></i></a>';
      html += '<a href="" ng-hide="editorEnabled($index)" ng-click="startEdit($index)"><i class="glyphicon glyphicon-pencil"></i></a>&nbsp;';
      
      // Do not show delete button for typeFixed lists
      if(attrs.typeFixed == undefined) {
        html += '<a href="" ng-hide="editorEnabled($index)" ng-click="removeItem($index)"><i class="glyphicon glyphicon-trash"></i></a>';
      }
      return html;
    }

    function updateView() {
      var html = '<div class="ex-array">';
      var _header = "<th class='grid-action-1'>#</th>";
      var _body   = "<td>{{ $index + 1}}.</td>";

      // Add New button
      if(attrs.typeFixed == undefined) {
        html += '<div ng-show="editorIndex == -1" class="pull-right" style="margin-top: -3px">';
        html += '  <a href="" ng-click="newItem()" class="btn btn-primary btn-xs" ng-hide="isViewOnly()">';
        html += '    <span class="glyphicon glyphicon-plus"></span> New';
        html += '  </a>';
        html += '</div>';
      }

      // Set title
      html += '<label><u>' + (attrs.title || '&nbsp;') + '</u></label>';
      
      angular.forEach(scope.columns, function(c) {
        _header += '<th ' + c.attrs + '>' + c.header + '</th>';
        if(c.fixed) {
          _body += '<td ' + c.attrs + '>{{ item.' + c.name + getFilter(c) + ' }}</td>';
        } else if(c['type'] == 'html') {
          _body += "<td " + c.attrs + " ng-bind-html=\"bindHtml(item." + c.name + ")\"></td>";
        } else {
          if(c['lookup']) {
            _body += '<td ' + c.attrs + ' ng-hide="editorEnabled($index)">{{ (lookup_' + c['lookup'] + ' | getLookupById:item.' + c.name + ').name' + getFilter(c) + ' }}</td>';
          } else {
            _body += '<td ' + c.attrs + ' ng-hide="editorEnabled($index)">{{ item.' + c.name + getFilter(c) + ' }}</td>';
          }
          _body += '<td ng-show="editorEnabled($index)">' + (c.html || inputEditor(c)) + '</td>';
        }
      });

      _header += '<th class="grid-action-2" ng-hide="isViewOnly()"></th>';

      // Action buttons
      _body   += '<td ng-hide="isViewOnly()">' + getButtons() + '</td>';

      html += '<table style="font-size: 12px;">';
      html += '  <thead>';
      html += '    <tr>';
      html +=        _header;
      html += '    </tr>';
      html += '  </thead>';
      html += '  <tbody>';
      html += '    <tr ng-repeat="item in ngModel">';
      html +=        _body;
      html += '    </tr>';
      html += '  </tbody>';
      html += '</table></div>';

      element.html(html);
      element.attr("class", "");
      angular.element(element).find("table").attr("class", attrs.class || "table table-condensed table-striped table-hover");
      $compile(element.contents())(scope);
    }

    scope.$watch('ngModel', function () {
      updateView();
    });

    scope.$watch('columns', function () {
      updateView();
    });
  };

  var controllerFn = ['$scope', '$element', 'ExMsgBox', '$filter', '$sce', function($scope, $element, ExMsgBox, $filter, $sce) {
    $scope.editorIndex = -1;
    $scope.isNewItem = false;

    $scope.$watch('lookups', function () {
      angular.forEach($scope.lookups, function(value, key) {
        $scope['lookup_' + key] = value;
      });
    }, true);

    $scope.startEdit = function (index) {
      $scope.prevRowData = angular.copy($scope.ngModel[index]);
      $scope.editorIndex = index;
      $scope.isNewItem = false;
    }

    $scope.editorEnabled = function (index) {
      return $scope.editorIndex == index;
    }

    $scope.removeItem = function (index) {
      var msg = "Are you sure you want to remove this item?";
      ExMsgBox.confirm(msg, ($scope.title || 'Confirm Delete')).then(function () {
      if($scope.onDelete) {
        $scope.onDelete(angular.copy($scope.ngModel[index]))
      }
        $scope.ngModel.splice(index, 1);
      });
    }

    function checkEmptyItem() {
      if(_.size($scope.ngModel[$scope.editorIndex]) == 1) {
        $scope.ngModel.splice($scope.editorIndex, 1);
      }
    }

    $scope.newItem = function () {
      $scope.ngModel = $scope.ngModel || [];
      $scope.ngModel.push({});
      $scope.editorIndex = $scope.ngModel.length - 1;
      $scope.isNewItem = true
    }

    $scope.saveEdit = function (item) {
      checkEmptyItem();
      if($scope.onCreate && $scope.isNewItem) {
        $scope.onCreate(angular.copy($scope.ngModel[$scope.editorIndex]))
      }
      else if($scope.onUpdate && !$scope.isNewItem) {
        $scope.onUpdate(angular.copy($scope.ngModel[$scope.editorIndex]))
      }
      $scope.editorIndex = -1;
    }

    $scope.cancelEdit = function () {
      angular.extend($scope.ngModel[$scope.editorIndex], $scope.prevRowData);
      checkEmptyItem();
      $scope.editorIndex = -1;
    }
  }];

  return {
    restrict: 'E',
    scope: {
      columns: "=",
      ngModel: "=",
      lookups: "=",
      onCreate: "=",
      onUpdate: "=",
      onDelete: "="
    },
    replace: true,
    link: linkFn,
    controller: controllerFn
  };
}]);
