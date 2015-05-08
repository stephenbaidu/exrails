require 'fileutils'

namespace :ng do
  desc "Creates views for resoucified models in angular app"
  task :layouts => :environment do |t, args|

    views_dir = Rails.root.join('angular', 'app', 'views').to_s
    
    dir = File.join(views_dir, 'layouts')
    Dir.mkdir(dir) unless File.directory?(dir)

    [:app, :login, :dashboard].each do |layout|
      file_path = File.join(dir, "#{layout}.html")
      File.open(file_path, 'w') do |file|
        file.write(html_layouts[layout])
      end unless File.exists?(file_path)
    end
    [:module1, :reports, :setups].each do |layout|
      file_path = File.join(dir, "#{layout}_module.html")
      File.open(file_path, 'w') do |file|
        html = html_layouts[:module]
        html.gsub! "--module placeholder--", layout.to_s
        file.write(html)
      end unless File.exists?(file_path)
    end
  end

  def html_layouts
    data = {}

    data[:app] = <<-eos
<!-- build:css(.tmp) styles/main.css -->
<link rel="stylesheet" href="styles/app.css">
<!-- endbuild -->

<div class="navbar navbar-inverse navbar-fixed-top ex-nav" role="navigation">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
        <span class="sr-only">Toggle navigation</span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a id="company_name" class="navbar-brand nav-h" href="#/app">
        {{ user.company }}
      </a>
    </div>
    <div class="navbar-collapse collapse">
      <ul class="nav navbar-nav">
        <li ng-class='{ active: hasUrl("#/app/module1") }'>
          <a href="#/app/module1">
            <span class="fa fa-home"></span>
            Staff Management
          </a>
        </li>
        <li ng-class='{ active: hasUrl("#/app/reports") }'>
          <a href="#/app/reports">
            <span class="fa fa-bar-chat"></span>
            Reports
          </a>
        </li>
        <li ng-class='{ active: hasUrl("#/app/setups") }'>
          <a href="#/app/setups">
            <span class="fa fa-cogs"></span>
            Setups
          </a>
        </li>
      </ul>
      <ul class="nav navbar-nav navbar-right">
        <li class="dropdown active">
          <a href="#" class="dropdown-toggle nav-h" data-toggle="dropdown">
            <i class="fa fa-user fa-lg"></i>
            {{ user.name }}
            <b class="caret"></b>
          </a>
          <ul class="dropdown-menu dropdown-inverse">
            <li><a href="<%= main_app.edit_user_registration_path %>">My Account</a></li>
            <li class="divider"></li>
            <li><a ng-click="signOut()">Logout</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</div>
<div id="page" class="container">
  <div ui-view></div>
</div>
    eos

    data[:login] = <<-eos

<!-- build:css(.tmp) styles/login.css -->
<link rel="stylesheet" href="styles/login.css">
<!-- endbuild -->

<div id="page">
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
          <h1 class="navbar-brand"><i class="fa fa-credit-card"></i> <a href="#/">Project Name</a></h1>
        </div>
      </div>
    </nav>
  </header>

  <main id="main" class="site-main">
    <section ng-if="!currentUser.signedIn" id="sign_in_box" class="section section-center sign-in-box section-hilite">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <h4>Sign in</h4>
            <form method="post" ng-submit="submitLogin(user)" name="loginForm" ng-init="user = {}" class="login-form">
              <div class="form-group has-feedback">
                <input class="form-control input-login" type="email" name="email" ng-model="user.email" placeholder="Email" required
                ng-pattern="/^[A-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/">
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
              <a href="#">Forgot your password?</a>
              </p>
              <p class="text-center">
              <a href="#">Didn't receive confirmation instructions?</a>
              </p>
              <p class="text-center">
              <a href="#">Didn't receive unlock instructions?</a>
              </p>
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
                ng-pattern="/^[A-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/">
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
          © 2015, Company Name.
          <br /> Designed by Company Name
        </p>
      </div>
    </div>
  </footer>
</div>

<div class="scroll-to-top" data-spy="affix" data-offset-top="600">
  <a href="#page" class="smooth-scroll">
    <i class="fa fa-arrow-up"></i>
  </a>
</div>

<script src="scripts/jquery.singlePageNav.min.js"></script>
<script src="scripts/main.js"></script>
    eos

    data[:dashboard] = <<-eos
Dashboard View
    eos

    data[:module] = <<-eos
<div id="sidebar" class="sidebar">
  <ul class="nav nav-pills nav-stacked">
    <li ng-repeat="l in modules.--module placeholder--.links" ng-class='{ active: hasUrl("#/app/--module placeholder--/{{ l.url }}") }'>
      <a href="#/app/--module placeholder--/{{ l.url }}">
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

    data
  end
end
