class Bucket < ApplicationRecord
  has_many :recordings, dependent: :destroy
  validates :name, presence: true, uniqueness: true
end
