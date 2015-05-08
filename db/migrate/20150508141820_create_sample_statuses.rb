class CreateSampleStatuses < ActiveRecord::Migration
  def change
    create_table :sample_statuses do |t|
      t.string :name

      t.timestamps null: false
    end
  end
end
