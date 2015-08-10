require 'fileutils'
require 'json'

namespace :ng do
  desc "Creates layout views for angular app"
  task :layouts => :environment do |t, args|
    ng_layouts
  end

  desc "Creates views for resoucified models in angular app"
  task :views => :environment do |t, args|
    ng_views
  end

  desc "Creates forms for angular schema form"
  task :schema_forms => :environment do |t, args|
    ng_schema_forms
  end
  desc "Creates fields for angular formly"
  task :formly_fields => :environment do |t, args|
    ng_formly_fields
  end

  def ng_layouts
    views_dir = Rails.root.join('angular', 'app', 'views').to_s
    
    dir = File.join(views_dir, 'layouts')
    Dir.mkdir(dir) unless File.directory?(dir)

    [:app, :login, :dashboard, :form].each do |layout|
      file_path = File.join(dir, "#{layout}.html")
      File.open(file_path, 'w') do |file|
        file.write(ng_html_layouts[layout])
      end unless File.exists?(file_path)
    end
    [:main, :reports, :setups].each do |layout|
      file_path = File.join(dir, "#{layout}_module.html")
      File.open(file_path, 'w') do |file|
        html = ng_html_layouts[:module]
        html.gsub! "--module placeholder--", layout.to_s
        file.write(html)
      end unless File.exists?(file_path)
    end
  end

  def ng_views
    views_dir = Rails.root.join('angular', 'app', 'views', 'app').to_s

    ng_resourcify_models.each do |model|
      begin
        @model_class = model.constantize
        
        dir = File.join(views_dir, model.pluralize.underscore.dasherize)
        Dir.mkdir(dir) unless File.directory?(dir)

        ['index', 'new', 'edit', 'show'].each do |action|
          file_path = File.join(dir, "#{action}.html")
          File.open(file_path, 'w') do |file|
            file.write(ng_view_html[action.to_sym])
          end unless File.exists?(file_path)
        end
      rescue
      end
    end
  end

  def ng_schema_forms
    scripts_dir = Rails.root.join('angular', 'app', 'scripts', 'services').to_s
    file_path = File.join(scripts_dir, '_form_service.js')
    file_content = ''

    ng_resourcify_models.each do |model|
      begin
        @model_class = model.constantize

        model_form = ''
        model_form = ng_schema_form.to_s
        model_form.gsub! 'model-key', model.underscore

        file_content += "\n\nforms['#{model.underscore}'] = "  + model_form + ';'
      rescue
      end
    end

    file_content = ng_form_service_template.gsub 'forms-here', file_content
    File.open(file_path, 'w') do |file|
      file.write(file_content)
    end
  end

  def ng_formly_fields
    scripts_dir = Rails.root.join('angular', 'app', 'scripts', 'services').to_s
    file_path = File.join(scripts_dir, '_field_service.js')
    file_content = ''

    ng_resourcify_models.each do |model|
      model_fields = ''

      begin
        @model_class = model.constantize

        model_fields = ng_fields.to_s
        model_fields.gsub! '"controller_function"', ng_controller_function
        model_fields.gsub! 'model-key', model.underscore
      rescue
      end

      file_content += "\n\nfields['#{model.underscore}'] = "  + model_fields + ';'
    end

    file_content = ng_field_service_template.gsub 'fields-here', file_content
    File.open(file_path, 'w') do |file|
      file.write(file_content)
    end
  end

  def ng_resourcify_models
    models = []
    excluded_models = ['Concern', 'PdfBuilder', 'User']
    Dir[Rails.root.join('app','models','*').to_s].each do |file|
      model = File.basename(file, ".*").classify
      unless models.include?(model) || excluded_models.include?(model)
        begin
          models << model if model.constantize.respond_to? 'resourcify_options'
        rescue
        end
      end
    end
    models
  end

  def ng_html_layouts
    data = {}

    data[:app] = <<-eos
<div class="navbar navbar-inverse navbar-fixed-top ex-nav" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a id="project_name" class="navbar-brand nav-h" href="#/">
        eXRails App
      </a>
    </div>
    <div class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
        <li ng-class='{ active: hasUrl("/main") }'>
          <a href="#/main">
            <span class="fa fa-home"></span>
            Home
          </a>
        </li>
        <li ng-class='{ active: hasUrl("/reports") }'>
          <a href="#/reports">
            <span class="fa fa-bar-chart"></span>
            Reports
          </a>
        </li>
        <li ng-class='{ active: hasUrl("/setups") }'>
          <a href="#/setups">
            <span class="fa fa-cogs"></span>
            Setups
          </a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown active">
          <a href="" class="dropdown-toggle nav-h" data-toggle="dropdown">
            <i class="fa fa-user fa-lg"></i>
            {{ user.name }}
            <b class="caret"></b>
          </a>
          <ul class="dropdown-menu dropdown-inverse">
            <li style="padding: 5px 15px;">
              Signed in as:<br>
              <b>{{ user.email }}</b>
            </li>
            <li class="divider"></li>
            <li><a href="" ng-click="showPasswordChange()">Change Password</a></li>
            <li class="divider"></li>
            <li><a href="" ng-click="signOut()">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</div>
<div id="page" class="container">
  <div ui-view></div>
</div>
<div ng-controller="UiCtrl"></div>
<div ng-controller="UserCtrl"></div>
    eos

    data[:login] = <<-eos
<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Lobster">
<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Roboto+Slab">
<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Roboto">
<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Rock+Salt">
<div class="login" id="page">
  <header id="header" class="site-header">
    <nav id="topbar" class="site-topbar">
      <div class="container">
        <div class="row">
          <div class="col-sm-6">Your tag line</div>
          <div class="social-links col-sm-6">
            <a href="#"><i class="fa fa-facebook"></i></a>
            <a href="#"><i class="fa fa-twitter"></i></a>
            <a href="#"><i class="fa fa-google-plus"></i></a>
            <a href="#"><i class="fa fa-pinterest"></i></a>
          </div>
        </div>
      </div>
    </nav>

    <nav id="navbar" class="site-navbar navbar navbar-static-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-collapse-1">
            <span class="sr-only">Toggle navigation</span>
            <i class="fa fa-bars"></i>
          </button>
          <h1 class="navbar-brand"><a href="#/"><img src="images/logo.png" alt=""> eXRails App</a></h1>
        </div>
      </div>
    </nav>
  </header>

  <main id="main" class="site-main">
    <section id="sign_in_box" class="section section-center sign-in-box section-hilite">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h4>Sign in</h4>
            <form method="post" ng-submit="submitLogin(user)" name="loginForm" ng-init="user = {}" class="login-form">
              <div class="form-group has-feedback">
                <input class="form-control input-login" type="email" name="email" ng-model="user.email" placeholder="Email" required
                ng-pattern="/^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$/">
                <span class="fa fa-envelope-o form-control-feedback"></span>
              </div>
              <div class="form-group has-feedback">
                <input class="form-control input-login" type="password" name="password" ng-model="user.password" placeholder="Password" required>
                <span class="fa fa-lock form-control-feedback"></span>
              </div>
              <button type="submit" ng-disabled="loginForm.$invalid" class="btn btn-block btn-primary btn-login">Log in</button>
              <div class="signup-or-separator">
                <h6 class="text">or</h6>
              </div>
              <p class="text-center">
              <a href="#" ng-click="sendPasswordResetEmail()">Forgot your password?</a>
              </p>
              <p class="text-center">
              <a href="#" ng-click="sendConfirmationInstructions()">Didn't receive confirmation instructions?</a>
              </p>
              <!-- <p class="text-center">
              <a href="#">Didn't receive unlock instructions?</a>
              </p> -->
            </form>
          </div>
          <div class="col-md-6">
            <h4>Sign up</h4>
            <form method="post" ng-submit="submitRegistration(user2)" name="signupForm" ng-init="user2 = {}" class="signup-form">
              <div class="form-group has-feedback" ng-class="{ 'has-error' : signupForm.name.$invalid && signupForm.name.$dirty }">
                <input class="form-control input-signup" type="text" name="name" ng-model="user2.name" placeholder="Name" required>
                <span class="fa fa-user form-control-feedback"></span>
                <div class="help-block text-danger" ng-if="signupForm.name.$dirty" ng-messages="signupForm.name.$error">
                  <div ng-message="required">You must enter a name.</div>
                </div>
              </div>
              <div class="form-group has-feedback" ng-class="{ 'has-error' : signupForm.email.$invalid && signupForm.email.$dirty }">
                <input class="form-control input-signup" type="email" id="email" name="email" ng-model="user2.email" placeholder="Email" required
                ng-pattern="/^([\\w-]+(?:\\.[\\w-]+)*)@((?:[\\w-]+\\.)*\\w[\\w-]{0,66})\\.([a-z]{2,6}(?:\\.[a-z]{2})?)$/">
                <span class="fa fa-envelope-o form-control-feedback"></span>
                <div class="help-block text-danger" ng-if="signupForm.email.$dirty" ng-messages="signupForm.email.$error">
                  <div ng-message="required">Your email address is required.</div>
                  <div ng-message="pattern">Your email address is invalid.</div>
                </div>
              </div>
              <div class="form-group has-feedback" ng-class="{ 'has-error' : signupForm.password.$invalid && signupForm.password.$dirty }">
                <input password-strength class="form-control input-signup" type="password" name="password" ng-model="user2.password" placeholder="Password" required>
                <span class="fa fa-lock form-control-feedback"></span>
                <div class="help-block text-danger" ng-if="signupForm.password.$dirty" ng-messages="signupForm.password.$error">
                  <div ng-message="required">Password is required.</div>
                </div>
              </div>
              <div class="form-group has-feedback" ng-class="{ 'has-error' : signupForm.confirm_password.$invalid && signupForm.confirm_password.$dirty }">
                <input password-match="user2.password" class="form-control input-signup" type="password" name="confirm_password" ng-model="user2.confirm_password" placeholder="Confirm Password">
                <span class="fa fa-lock form-control-feedback"></span>
                <div class="help-block text-danger" ng-if="signupForm.confirm_password.$dirty" ng-messages="signupForm.confirm_password.$error">
                  <div ng-message="compareTo">Passwords must match.</div>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <p class="text-center text-muted"><small>By clicking Sign up, you agree to our <a href="#">terms & conditions</a></small></p>
                  
                </div>
                <div class="col-md-6">
                  <button type="submit" ng-disabled="signupForm.$invalid" class="btn btn-signup btn-block btn-primary">Sign up</button>
                  
                </div>
              </div>
              <br/>
            </form>
          </div>
        </div>
      </div>
  </main>

  <footer id="footer" class="site-footer navbar navbar-default navbar-fixed-bottom">
    <div class="container">
      <div class="copyright">
        <p>
          © 2015 eXRails App.
          <br /> baidus.net
        </p>
      </div>
    </div>
  </footer>
</div>
    eos

    data[:dashboard] = <<-eos
Dashboard View
    eos

    data[:module] = <<-eos
<div id="sidebar" class="sidebar">
  <ul class="nav nav-pills nav-stacked">
    <li ng-repeat="l in modules.--module placeholder--.links" ng-class='{ active: hasUrl("#/--module placeholder--/{{ l.url }}") }' ng-show="hasAccess(l.url)">
      <a href="#/--module placeholder--/{{ l.url }}">
        <span class="{{ l.icon }}"></span>
        <br><span class="link-text">{{ l.text }}</span>
      </a>
    </li>
  </ul>
</div>
<div id="content" class="content">
  <ui-view></ui-view>
</div>
    eos

    data[:form] = <<-eos
<div class="row">
  <div class="col-md-12">
    <div id="page_header" class="clearfix content-header">
      <h3 class="pull-left"> 
        <i class="glyphicon glyphicon-list"></i>
        Form
      </h3>
    </div>
  </div>
</div>
<div class="row">
  <div class="col-md-8 col-md-offset-2">
    <br>
    <ui-view></ui-view>
  </div>
</div>
    eos

    data
  end

  def ng_view_html
    data = {}

    data[:index] = <<-eos
<div ng-include="partials.header"></div>
<div ng-if="state.isIndex">
  <div ng-include="partials.searchForm"></div>
</div>
<div class="row model-container">
  <div ng-show="state.isIndex" class="col-md-12">
    <div ng-include="partials.indexGrid"></div>
    <div ng-include="partials.loadMoreButton"></div>
  </div>
  <div ng-hide="state.isIndex" class="col-md-4 hidden-sm hidden-xs">
    <div ng-include="partials.nameGrid"></div>
    <div ng-include="partials.loadMoreButton"></div>
  </div>
  <div ng-hide="state.isIndex" class="col-md-8 no-left">
    <div ng-include="partials.formNav" style="margin-bottom: 6px;"></div>
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
    <div ng-include="partials.schemaForm"></div>
  </div>
  <div class="panel-footer">
    <div ng-include="partials.formNewButtons"></div>
  </div>
</div>
    eos

    data[:show] = <<-eos
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{ schema.title }}</h3>
  </div>
  <div class="panel-body">
    <div ng-include="partials.schemaForm"></div>
  </div>
  <div class="panel-footer">
    <div ng-include="partials.formShowButtons"></div>
  </div>
</div>
    eos

    data[:edit] = <<-eos
<div class="panel panel-default">
  <div class="panel-heading">
    <h3 class="panel-title">{{ schema.title }}</h3>
  </div>
  <div class="panel-body">
    <div ng-include="partials.schemaForm"></div>
  </div>
  <div class="panel-footer">
    <div ng-include="partials.formEditButtons"></div>
  </div>
</div>
    eos

    data
  end

  def ng_schema_form
    json_form = []

    foreign_keys = @model_class.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }

    columns = @model_class.columns.select {|c| !ng_schema_form_excluded? c.name }
    columns.each_slice(2) do |cols|
      section = {
        type: "section",
        htmlClass: "row",
        items: []
      }
      cols.each do |col|
        field = { key: col.name.to_sym }
        field[:fieldHtmlClass] = "input-lg"

        # Check if date
        if col.type == :date
          field[:type] = "datepicker"
          field[:pickadate] = {
            selectYears: true,
            selectMonths: true
          }
        elsif col.type == :datetime
          field[:type] = "datepicker"
          # field[:format] = "yyyy-mm-dd"
          field[:pickadate] = {
            selectYears: true,
            selectMonths: true,
            format: "yyyy-mm-dd"
          }
        end

        # Is it a lookup
        if foreign_keys.keys.include?(col.name) ||
          (@model_class.respond_to?(:acts_as_nested_set) && col.name == 'parent_id')
          
          lookup = foreign_keys[col.name]
          field[:fieldHtmlClass] = "input-lg selectpicker"

          if foreign_keys[col.name] == :children
            lookup = :parent
          end

          field[:lookup] = lookup
        end

        section[:items] << {
          type: "section",
          htmlClass: "col-sm-6 col-xs-12",
          items: [field]
        }
      end

      json_form << section
    end
    JSON.pretty_generate(json_form, {})
  end

  def ng_form_service_template
    <<-eos
'use strict';

/**
 * @ngdoc service
 * @name angularApp.formService
 * @description
 * # formService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('formService', function () {
    var forms = {};

    var formSVC = {
      get: function (modelInSnakeCase) {
        return angular.copy(forms[modelInSnakeCase]) || [];
      }
    };
forms-here

    return formSVC;
  });
    eos
  end

  def ng_schema_form_excluded?(field)
    [
      'id', 'created_at', 'updated_at', 'deleted_at', 'details',
      'lft', 'rgt', 'depth'
    ].include? field
  end

  def ng_fields
    json_form = []

    foreign_keys = @model_class.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_sym }

    required_fields = @model_class.validators.map {|e| e.presence.attributes }.flatten

    columns = @model_class.columns.select {|c| !ng_schema_form_excluded? c.name }
    columns.each_slice(2) do |cols|
      fields = []
      cols.each do |col|
        field = {
          className: 'col-xs-6',
          key: col.name,
          type: 'input',
          templateOptions: {
            required: required_fields.include?(col.name.to_sym),
            label: col.name.titleize
          }
        }

        # Check if date
        if col.type == :date|| col.type == :datetime
          field[:type] = "datepicker"
        
        # Is it a lookup
        elsif foreign_keys.keys.include?(col.name) ||
          (@model_class.respond_to?(:acts_as_nested_set) && col.name == 'parent_id')
          
          lookup = foreign_keys[col.name]

          if foreign_keys[col.name] == :children
            lookup = :parent
          end

          field[:type] = "ui-select"
          field[:templateOptions][:lookup] = lookup
          field[:templateOptions][:valueProp] = 'value'
          field[:templateOptions][:labelProp] = 'name'
          field[:templateOptions][:options] = []
          field[:controller] = 'controller_function'
        elsif ng_multiselect_field?(col.name)
          klass = get_multiselect_class(col.name)
          label = klass.name.titleize

          field[:type] = "ui-select-multiple"
          field[:templateOptions][:lookup] = klass.name.underscore
          field[:templateOptions][:label] = label
          field[:templateOptions][:placeholder] = "Select #{label.pluralize.downcase} ..."
          field[:templateOptions][:valueProp] = 'value'
          field[:templateOptions][:labelProp] = 'name'
          field[:templateOptions][:options] = []
          field[:controller] = 'controller_function'
        elsif ng_tag_field?(col.name)
          klass = get_tag_class(col.name)

          field[:type] = "ui-select-multiple"
          field[:templateOptions][:lookup] = klass.name.underscore
          field[:templateOptions][:placeholder] = 'Select tags ...'
          field[:templateOptions][:valueProp] = 'value'
          field[:templateOptions][:labelProp] = 'name'
          field[:templateOptions][:options] = []
          field[:controller] = 'controller_function'
        end

        fields << field
      end

      json_form << {
        fieldGroup: fields
      }
    end
    JSON.pretty_generate(json_form, {})
  end

  def ng_field_service_template
    <<-eos
'use strict';

/**
 * @ngdoc service
 * @name angularApp.fieldService
 * @description
 * # fieldService
 * Service in the angularApp.
 */
angular.module('angularApp')
  .service('fieldService', function () {
    var fields = {};

    var fieldSVC = {
      get: function (modelInSnakeCase) {
        return angular.copy(fields[modelInSnakeCase]) || [];
      }
    };
fields-here

    return fieldSVC;
  });
    eos
  end

  def is_nested_set
    @model_class.respond_to? 'acts_as_nested_set_options'
  end

  def lookup_array(klass, blanks = false)
    result = []
    begin
      result = klass.all.map { |e| {value: e.id, name: e.name} }
      result.unshift({ value: '', name: '' }) if blanks
    rescue
    end
    result
  end

  def ng_multiselect_field?(field_name)
    return false unless field_name.ends_with? '_ids'

    begin
      field_name.name[0, field_name.name.length - 4].classify.constantize
      return true
    rescue
    end
    return false
  end

  def get_multiselect_class(field_name)
    return field_name.name[0, field_name.name.length - 4].classify.constantize
  end

  def ng_tag_field?(field_name)
    return false unless field_name == 'tags'

    begin
      "#{@model_class.name}Tag".constantize
      return true
    rescue
    end
    return false
  end

  def get_tag_class(field_name)
    return "#{@model_class.name}Tag".constantize
  end

  def ng_controller_function
    <<-eos
/* @ngInject */ function($scope, lookupService) {
          lookupService.load('model-key').then(function() {
            $scope.to.options = lookupService.get('model-key', $scope.to.lookup);
          });
        }
    eos
  end
end
