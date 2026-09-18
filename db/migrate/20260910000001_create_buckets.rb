class CreateBuckets < ActiveRecord::Migration[8.1]
  def change
    create_table :buckets do |t|
      t.string :name, null: false
      t.string :bucketable_type
      t.bigint :bucketable_id
      t.timestamps
    end
    add_index :buckets, [:bucketable_type, :bucketable_id]
    add_index :buckets, :name, unique: true
  end
end
