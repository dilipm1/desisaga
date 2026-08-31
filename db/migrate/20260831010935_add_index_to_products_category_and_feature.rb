class AddIndexToProductsCategoryAndFeature < ActiveRecord::Migration[8.1]
  def change
    add_index :products, :category
    add_index :products, :featured
  end
end
