class CreateRecordings < ActiveRecord::Migration[8.1]
  def change
    create_table :recordings do |t|
      t.references :bucket, null: false, foreign_key: true
      t.references :parent, foreign_key: { to_table: :recordings }
      t.string :recordable_type, null: false
      t.bigint :recordable_id, null: false
      t.bigint :creator_id
      t.integer :position
      t.string :status, default: "active"
      t.timestamps
    end
    add_index :recordings, [ :recordable_type, :recordable_id ]
    add_index :recordings, [ :bucket_id, :recordable_type ]
  end
end
