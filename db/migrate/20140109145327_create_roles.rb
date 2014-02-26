class CreateRoles < ActiveRecord::Migration
  def change
    create_table :roles do |t|
      t.string :name
      t.string :permissions, array: true, length: 30, using: 'gin', default: '{}'

      t.timestamps
    end
    
    add_index :roles, :name, :unique => true
  end
end
