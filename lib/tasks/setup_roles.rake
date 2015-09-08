namespace :app do
  desc 'Creates default roles'
  task :setup_roles => :environment do |t, args|

    # Default user roles
    [
      {
        name: 'Manager',
        permissions: [
          'sample:icsud', 'sample_status:is'
        ]
      }, {
        name: 'Clerk',
        permissions: [
          'sample:ics', 'sample_status:is'
        ]
      }
    ].each do |role|
      next if Role.where(name: role[:name]).exists?
      
      permissions = role[:permissions].map do |p|
        p.split(':').second.split('').map do |p2|
          p.split(':').first.classify + ':' + {
            i: 'index', c: 'create', s: 'show', u: 'update', d: 'delete'
          }[p2.to_sym]
        end
      end.flatten

      Role.create name: role[:name], permissions: permissions
    end
  end
end