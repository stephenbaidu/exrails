namespace :app do
  desc 'Creates lookups'
  task :lookups => :environment do |t, args|

    # # **********************************
    # # Sample code for populating lookups
    # # **********************************
    # 
    # {
    #   'Title'  => ["Dr.", "Mr.", "Ms."],
    #   'Gender' => ["Male", "Female"]
    # }.each do |k, v|
    #   klass = k.to_s.constantize
    #   v.each { |n| klass.create(name: n) } if klass.count == 0
    # end
  end
end
