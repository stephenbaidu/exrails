require 'fileutils'

namespace :ng do
  desc "Creates views for resoucified models in angular app"
  task :views => :environment do |t, args|
    models = []
    Dir[Rails.root.join('app','models','*').to_s].each do |file|
       model = File.basename(file, ".*").classify
       models << model unless models.include?(model)
    end
    
    views_dir = Rails.root.join('angular', 'app', 'views', 'app').to_s

    models.each do |model|
      begin
        if model.constantize.respond_to? "resourcify_options"
          dir = File.join(views_dir, model.pluralize.underscore.dasherize)
          Dir.mkdir(dir) unless File.directory?(dir)

          ['index', 'new', 'edit', 'show'].each do |action|
            file_path = File.join(dir, "#{action}.html")
            File.open(file_path, 'w') do |file|
              file.write(html[action.to_sym])
            end unless File.exists?(file_path)
          end
        end
      rescue Exception => e
      end
    end
  end

  def html
    data = {}

    data[:index] = <<-eos
<div class="row">
  <div class="col-md-12">
    <div id="page_header" class="clearfix content-header">
      <h3 class="pull-left"> 
        <i class="glyphicon glyphicon-list"></i>
        {{ model.title }}
      </h3>
      <div class="btn-group pull-right">
        <a class="btn btn-primary" ng-click="search_on=!search_on" data-toggle="button">
          <span class="fa fa-search"></span>
        </a>
        <a class="btn btn-success pull-right" ui-sref=".new">
          <span class="fa fa-plus"></span> New
        </a>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-4 form-group hidden-sm hidden-xs">
    <div class="input-group">
      <div class="input-group-btn">
        <button type="button" class="btn btn-default" aria-expanded="false"><span class="fa fa-search"></span></button>
      </div>
      <input type="text" class="form-control" ng-model="filterText" aria-label="...">
    </div>
  </div>
  <div ng-hide="state.isIndex" class="col-md-8 no-left" style="padding-bottom: 5px;">
    <div class="row">
      <div class="col-xs-6">
        <button class="btn btn-default" ng-click="back()">
          <span class="fa fa-chevron-left"></span>
          Back
        </button>
      </div>
      <div class="col-xs-6">
        <div ng-if="paging.currentId" class="btn-group pull-right">
          <a ng-disabled="!paging.previousId" class="btn btn-default" ui-sref=".show({id: paging.previousId})">
            <span class="fa fa-chevron-left"></span>
          </a>
          <a ng-disabled="!paging.currentId" class="btn btn-default" ui-sref=".edit({id: paging.currentId})">
            {{ paging.currentId }}
          </a>
          <a ng-disabled="!paging.nextId" class="btn btn-default" ui-sref=".show({id: paging.nextId})">
            <span class="fa fa-chevron-right"></span>
          </a>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="row">
  <div ng-show="state.isIndex" class="col-md-12">
    <table class="table table-bordered table-striped table-hover">
      <thead>
        <tr>
          <th class='grid-action-1'></th>
          <th ng-repeat="field in grid">
            {{ schema.properties[field].title }}
          </th>
          <th class="grid-action-1"></th>
        </tr>
      </thead>
      <tbody data-link="row" class="rowlink">
        <tr ng-repeat="rec in records | filter:filterText">
          <td>{{ $index + 1 }}.</td>
          <td ng-repeat="field in grid">
            {{ fieldData(rec, field) }}
          </td>
          <td>
            <a href="#" ui-sref=".show({id: rec.id})" tooltip-placement="left" tooltip="View">
              <span class="fa fa-lg fa-chevron-right"></span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pull-right">
      <button ng-disabled="action.loading" type="button" class="btn btn-success" ng-click="loadMore()">
        <span class="fa fa-spinner" ng-class="{'fa-pulse': action.loading}"></span>
        {{ (action.loading)? "Loading..." : "More" }}
      </button>
    </div>
  </div>
  <div ng-hide="state.isIndex" class="col-md-4 hidden-sm hidden-xs">
    <table class="table table-bordered table-striped table-hover">
      <thead>
        <tr>
          <th class='grid-action-1'></th>
          <th>Name</th>
          <th class="grid-action-1"></th>
        </tr>
      </thead>
      <tbody data-link="row" class="rowlink">
        <tr ng-repeat="rec in records | filter:filterText" ng-class="{active: rec.id == paging.currentId}">
          <td>{{ $index + 1 }}.</td>
          <td>
            {{ rec.name }}
          </td>
          <td>
            <a href="#" ui-sref=".show({id: rec.id})" tooltip-placement="left" tooltip="View">
              <span class="fa fa-lg fa-chevron-right"></span>
            </a>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="pull-right">
      <button ng-disabled="action.loading" type="button" class="btn btn-success" ng-click="loadMore()">
        <span class="fa fa-spinner" ng-class="{'fa-pulse': action.loading}"></span>
        {{ (action.loading)? "Loading..." : "More" }}
      </button>
    </div>
  </div>
  <div ng-hide="state.isIndex" class="col-md-8 no-left">
    <div ui-view></div>
  </div>
</div>
    eos

    data[:new] = <<-eos
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{ schema.title }}</h3>
  </div>
  <div class="panel-body">
    <form name="formObject" sf-schema="schema" sf-form="form" sf-model="record"></form>
  </div>
  <div class="panel-footer">
    <button class="btn btn-default btn-sm" ng-click="cancel()">
      <span class="glyphicon glyphicon-remove"></span>
      Cancel
    </button>
    <button ng-disabled="action.creating" class="btn btn-info btn-sm" ng-click="save()">
      <span class="glyphicon glyphicon-ok"></span>
      {{ (action.creating)? "Saving..." : "Save" }}
    </button>
  </div>
</div>
    eos

    data[:show] = <<-eos
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{ schema.title }}</h3>
  </div>
  <div class="panel-body">
    <form disabled-form sf-schema="schema" sf-form="form" sf-model="record"></form>
  </div>
  <div class="panel-footer">
    <button class="btn btn-info btn-sm" ng-click="edit()">
      <span class="glyphicon glyphicon-pencil"></span>
      Edit
    </button>
  </div>
</div>
    eos

    data[:edit] = <<-eos
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{ schema.title }}</h3>
  </div>
  <div class="panel-body">
    <form name="formObject" sf-schema="schema" sf-form="form" sf-model="record"></form>
  </div>
  <div class="panel-footer">
    <button class="btn btn-default btn-sm" ng-click="cancel()">
      <span class="glyphicon glyphicon-remove"></span>
      Cancel
    </button>
    <button ng-disabled="action.updating" class="btn btn-info btn-sm" ng-click="save()">
      <span class="glyphicon glyphicon-ok"></span>
      {{ (action.updating)? "Updating..." : "Update" }}
    </button>
  </div>
</div>
    eos

    data
  end
end
