class CreateItems < ActiveRecord::Migration[7.1]
  def change
    create_table :items do |t|
      t.string :title
      t.integer :parent_id
      t.integer :user_id
      t.integer :position
      t.boolean :completed

      t.timestamps
    end
  end
end
