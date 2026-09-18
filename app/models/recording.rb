class Recording < ApplicationRecord
  belongs_to :bucket
  belongs_to :parent, class_name: "Recording", optional: true
  has_many :children, class_name: "Recording", foreign_key: :parent_id, dependent: :nullify
  delegated_type :recordable, types: %w[ProductRecordable]
  validates :recordable, presence: true
end
