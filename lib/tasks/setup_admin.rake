namespace :app do
  desc 'Creates default user: admin'
  task :setup_admin => :environment do |t, args|

    # Create admin role
    role = Role.where(name: 'Admin').first_or_create do |r|
      r.permissions = []
    end

    # Create admin user
    user = User.where(:email => 'admin@exrails.com').first_or_create do |u|
      u.uid = 'admin@exrails.com'
      u.provider = 'email'
      u.name = 'System Admin'
      u.password = 'admin123'
      u.password_confirmation = 'admin123'
      u.confirmation_sent_at = Date.today
      u.confirmed_at = Date.today
      u.role_ids = [role.id]
    end

    # Update admin user's roles
    # UserRole.where(user: user, role: role).first_or_create

  end
end