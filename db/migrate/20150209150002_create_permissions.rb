class CreatePermissions < ActiveRecord::Migration
  def change
    create_table :permissions do |t|
      t.string :name
      t.string :status

      t.timestamps null: false
    end
    
    add_index :permissions, :name, :unique => true
  end
end
