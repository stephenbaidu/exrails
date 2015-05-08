class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.string :name
      t.text :permissions, default: [].to_yaml
      t.string :status

      t.timestamps null: false
    end
    
    add_index :roles, :name, :unique => true
  end
end
