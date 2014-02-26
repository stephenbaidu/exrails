namespace :app do
  desc "Creates default user: admin"
  task :setup_admin => :environment do |t, args|


    # Create admin role
    role = Role.where(name: "Admin").first_or_create do |r|
      r.permissions = []
    end

    # Create admin user
    user = User.where(:username => 'admin').first_or_create do |u|
      u.name = "System Admin"
      u.username   = "admin"
      u.email      = "admin@exrails-app.com"
      u.password   = "admin123"
      u.password_confirmation = "admin123"
      u.role_ids = [role.id]
    end

    # Update admin user's roles
    # UserRole.where(user: user, role: role).first_or_create

  end
end
