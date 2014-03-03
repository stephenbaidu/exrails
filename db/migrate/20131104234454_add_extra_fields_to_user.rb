class AddExtraFieldsToUser < ActiveRecord::Migration
  def change
    add_column :users, :name, :string
    add_column :users, :username, :string
    # add_column :users, :role_ids, :integer, array: true, null: false, default: []
    add_column :users, :role_ids, :string, default: [].to_yaml
  end
end
