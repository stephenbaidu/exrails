class AddExtraFieldsToUser < ActiveRecord::Migration
  def change
    add_column :users, :name, :string
    add_column :users, :username, :string
    add_column :users, :role_ids, :integer, array: true, null: false, default: []
  end
end
