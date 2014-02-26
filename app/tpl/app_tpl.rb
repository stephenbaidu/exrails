class AppTpl

  def self.modules
    {
      admin: { text: "Admin Center", url: "admin", dropdown: true, 
        links: [
          { text: "Users", url: "users", icon: "fa fa-users" },
          { text: "Roles", url: "roles", icon: "fa fa-sort-numeric-asc" }
        ]
      }
    }
  end

  def self.columns(model = self.name)
    _rc = get_rc(model)

    fields = []
    foreign_keys = _rc.reflections.each_with_object({}) {|(k, v), h| h[v.foreign_key] = v.name.to_s }

    _rc.columns.each do |c|
      f = { name: c.name, type: c.type.to_s, label: c.name.titleize }
      if foreign_keys.keys.include?(c.name)
        f[:lookup] = foreign_keys[c.name]
        f[:label]  = c.name[0, c.name.length - 3].titleize if c.name.ends_with?("_id")
        if foreign_keys[c.name] == 'children'
          f[:lookup] = :parent
          f[:label]  = "Parent #{model.singularize.titleize}"
        end
      end
      fields.push f
    end

    fields
  rescue Exception => e
    p e
    []
  end

  def self.lookups(model = self.name)
    if _tpl = method_exists?(model, 'lookups')
      return _tpl.new.lookups
    end

    _rc = get_rc(model)

    lookups = {}
    associations = _rc.reflect_on_all_associations(:belongs_to).map { |a| a.name }
    associations.each do |assoc|
      if assoc.to_s == "parent"
        lookups[:parent] = _rc.all
      else
        lookups[assoc.to_s.to_sym] = get_rc(assoc).all
      end
    end

    lookups
  rescue Exception => e
    {}
  end

  def self.form_columns(model)
    if _tpl = method_exists?(model, 'form_columns')
      return _tpl.new.form_columns
    end

    excluded_fields  = ["id", "created_at", "updated_at", "lft", "rgt", "depth"]
    fields = self.columns(model).select { |e| !excluded_fields.include? e[:name] }

  rescue Exception => e
    []
  end

  def self.grid_columns(model)
    if _tpl = method_exists?(model, 'grid_columns')
      return _tpl.new.grid_columns
    end

    excluded_fields  = ["id", "created_at", "updated_at", "lft", "rgt", "depth"]
    fields = self.columns(model).select { |e| !excluded_fields.include? e[:name] }

  rescue Exception => e
    []
  end

  def self.options(model)
    if _tpl = method_exists?(model, 'options')
      return _tpl.new.options
    end
    {}
  rescue
    {}
  end

  def self.filters(model)
    if _tpl = method_exists?(model, 'filters')
      return _tpl.new.filters
    end
  rescue
    []
  end

  private
    def self.method_exists?(model, method)
      _tpl = "#{model.to_s.classify}Tpl".constantize

      if _tpl.new.respond_to?(method)
        _tpl
      else
        false
      end
    rescue
      false
    end

    def self.get_rc(model)
      model = model.to_s.classify
      model = model[(0..model.length-1-3)] if model.ends_with? "Tpl"
      "#{model}".constantize
    end
end