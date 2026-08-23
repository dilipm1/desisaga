class Product < ApplicationRecord
  CATEGORIES = [
    "Diwali",
    "Puja",
    "Wedding",
    "Housewarming",
    "Navratri",
    "Raksha Bandhan",
    "Holi",
    "Ganesh Chaturthi"
  ].freeze

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true,
    format: { with: /\A[a-z0-9-]+\z/, message: "must be lowercase letters, numbers, and dashes" }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :category, inclusion: { in: CATEGORIES }

  scope :featured, -> { where(featured: true) }
  scope :in_category, ->(category) { where(category: category) }
  scope :search, ->(query) {
    q = "%#{query.to_s.downcase}%"
    where("lower(name) LIKE :q OR lower(description) LIKE :q OR lower(tags) LIKE :q", q: q)
  }

  def self.find_by_slug!(slug)
    find_by!(slug: slug)
  end

  def primary_image
    images&.first
  end

  def to_param
    slug
  end
end
