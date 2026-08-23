class CreateProducts < ActiveRecord::Migration[8.1]
  def change
    create_table :products do |t|
      t.string :name
      t.string :slug
      t.text :description
      t.integer :price
      t.string :currency
      t.string :category
      t.json :images
      t.boolean :in_stock
      t.boolean :featured
      t.json :tags
      t.json :ritual_contents

      t.timestamps
    end
    add_index :products, :slug, unique: true
  end
end
