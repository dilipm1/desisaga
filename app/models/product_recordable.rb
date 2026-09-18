class ProductRecordable < ApplicationRecord
  has_one :recording, as: :recordable, dependent: :destroy
  validates :name, :slug, :price, :category, presence: true
end
