class CreateProductRecordables < ActiveRecord::Migration[8.1]
  def change
    create_table :product_recordables do |t|
      t.string :name, null: false
      t.string :slug, null: false
      t.integer :price, null: false
      t.string :category, null: false
      t.string :region
      t.text :description
      t.json :images
      t.json :tags
      t.json :ritual_contents
      t.boolean :featured, default: false
      t.boolean :in_stock, default: true
      t.string :currency, default: "INR"
      t.timestamps
    end
    add_index :product_recordables, :slug, unique: true
    add_index :product_recordables, :category
  end
end
