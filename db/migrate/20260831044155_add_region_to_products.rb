class AddRegionToProducts < ActiveRecord::Migration[8.1]
  def change
    add_column :products, :region, :string
    add_index :products, :region
  end
end
