class AddRoleAndNameToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :role, :string, default: "customer", null: false
    add_column :users, :name, :string
  end
end
