if Rails.env != 'test'
  email_settings = YAML::load(File.open(Rails.root.join('config', 'email.yml').to_s))
  ActionMailer::Base.smtp_settings = email_settings[Rails.env] unless email_settings[Rails.env].nil?
end