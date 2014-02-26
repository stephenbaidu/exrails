angular.module("app").directive("exQuery", ['$http', '$compile', function ($http, $compile) {
  var linkFn = function (scope, element, attrs, ctrl) {
    scope.columns = scope.columns || [];

    var tpl = '<form role=form><div ng-repeat="item in modelList"><div class="form-group col-md-6" ng-if=_isType(item.type)><label class=control-label><a href="" ng-click=removeItem($index) class=ax-search-remove><i class="glyphicon glyphicon-remove"></i></a> {{ item._label }}</label><div style="width: 70%" ng-if="_isText(item.type) && !item._lookup" class="input-group input-group-sm"><span class=input-group-addon><input type=checkbox checked ng-model=item.on></span> <span class=input-group-addon><select ng-model=item.op><option value=like>%<option value=eq>=<option value=noteq>&lt;&gt;</select></span><input class=form-control ng-model=item.value></div><div style="width: 40%" ng-if="_isNumber(item.type) && !item._lookup" class="input-group input-group-sm"><span class=input-group-addon><input type=checkbox checked ng-model=item.on></span> <span class=input-group-addon><select ng-model=item.op><option value=eq>=<option value=lt>&lt;<option value=gt>&gt;<option value=lteq>&lt;=<option value=gteq>&gt;=</select></span><input type=number class=form-control ng-model=item.value></div><div style="width: 50%" ng-if=_isDate(item.type) class="input-group input-group-sm"><span class=input-group-addon><input type=checkbox checked ng-model=item.on></span> <span class=input-group-addon><select ng-model=item.op><option value=eq>=<option value=lt>&lt;<option value=gt>&gt;<option value=lteq>&lt;=<option value=gteq>&gt;=</select></span><input datepicker-popup=dd-MMM-yy class=form-control show-weeks=false datepicker-append-to-body=true ng-model=item.value></div><div style="width: 90%" ng-if=item._lookup class="input-group input-group-sm select2-bootstrap-prepend"><span class=input-group-addon><input type=checkbox checked ng-model=item.on></span> <span class=input-group-addon><select ng-model=item.op><option value=in>=<option value=notin>&lt;&gt;</select></span><select ui-select2="" multiple class="form-control select2" ng-model=item.value><option ng-repeat="l in item._lookup" value="{{ l.id }}">{{ l.name }}</select></div></div></div><div class=clearfix></div><div class="form-group col-md-6"><label class=control-label>&nbsp;</label><div class="input-group input-group-sm select2-bootstrap-append"><select ui-select2="" class=form-control ng-model=column_name><option ng-repeat="l in columns" value="{{ l.name }}">{{ l.label || l.name }}</select><span class=input-group-btn><button class="btn btn-info" ng-click=addItem()><i class="glyphicon glyphicon-plus"></i><b>Add More</b></button></span></div></div></form>'; 
    
    function updateView() {
      element.html(tpl);
      $compile(element.contents())(scope);
    }

    scope.$watchCollection(['ngModel', 'columns'], function () {
      updateView();
    });
  };

  var controllerFn = ['$scope', '$element', function($scope, $element) {
    $scope.modelList = [];

    // Show visible columns
    $scope.$watch('columns', function() {
      $scope.modelList = [];
      _.each($scope.columns, function (c) {
        $scope.column = c;
        $scope.addItem();
      });
    });

    $scope.$watch('modelList', function() {
      var filter = function(c) { return c.on == true && !!c.value }
      var map = function(c) { return c.name + '::' + c.op + '::' + c.value + '::' + c.type; }
      $scope.ngModel = _.chain($scope.modelList).filter(filter).map(map).value().join(';;');
    }, true);

    $scope.$watch('column_name', function () {
      $scope.column = _.find($scope.columns, function (c) {
        return c.name == $scope.column_name;
      });
    });

    $scope._isText = function(t) {
      return (t == "text" || t == "string")
    }

    $scope._isNumber = function(t) {
      return (t == "integer" || t == "float" || t == "decimal")
    }

    $scope._isDate = function(t) {
      return (t == "date" || t == "datetime")
    }

    $scope._isType = function(t) {
      return $scope._isText(t) || $scope._isNumber(t) || $scope._isDate(t);
    }

    $scope.addItem = function () {
      if(!$scope.column) return;

      var type = $scope.column['type'] || 'string';

      var item = {
        name: $scope.column.name,
        type: type,
        _label:  ($scope.column.label || $scope.column.name),
        _lookup: ($scope.column['lookup'] && $scope['lookups'] && $scope.lookups[$scope.column['lookup']]),
        on: true,
        op: $scope._isText(type)? 'like':($scope.column['lookup']? 'in':'eq'),
        value: ''
      };
      
      $scope.modelList.push(item);
    }

    $scope.removeItem = function (index) {
      $scope.modelList.splice(index, 1);
    }
  }];

  return {
    restrict: 'E',
    scope: {
      ngModel: "=",
      columns: "=",
      lookups: "="
    },
    replace: true,
    link: linkFn,
    controller: controllerFn
  };
}]);
