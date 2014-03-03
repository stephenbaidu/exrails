# Helper for engines to interract with main app and other engines

module BaseInterop

  class AppInterop < Struct.new(:_app)

    @_object = nil

    def run(action, parameters = {})
      "You called action: #{action} on app: #{_app}"
    end

    def permission
      @_object = :permission
      self
    end

    def role
      @_object = :role
      self
    end

    def user
      @_object = :user
      self
    end

    def create(name, options = nil)
      if @_object == :permission
        Permission.where(name: name).first_or_create
      end
      puts "#{@_object.to_s.titleize} created => #{name}"
    end

    def list
      "You've listed from #{@_object.to_s}"
      [
        { name: 'HRM', url: 'hrm'},
        { name: 'Point of Sale', url: 'pos'},
        { name: 'Accounting', url: 'accounting'}
      ]
    end

    def exists?(name)
      "Exists on #{@_object.to_s}"
    end

    def name
      _app
    end
  end

  def self.app(app_name = nil)
    AppInterop.new(app_name)
  end

  def self.log(val, title = nil)
    puts "#{'*' * 32}\nLog :: #{(title or 'Message')}\n#{'*' * 32}"
    p val
    puts "*" * 32
  end

  def _app(app_name = nil)
    BaseInterop.app(app_name)
  end

  def _log(val, title = nil)
    BaseInterop.log(val, title)
  end
end
