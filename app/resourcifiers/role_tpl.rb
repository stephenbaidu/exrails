class RoleTpl

  def lookups
    {
      permission: Permission.all
    }
  end

  def grid_columns
    [
      {:name=>"name", :type=>"string", :label=>"Name"},
      {:name=>"users", :type=>"string", :label=>"Number of Users"}
    ]
  end
end