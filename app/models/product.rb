class Product < ApplicationRecord
  CATEGORIES = [
    "Diwali",
    "Puja",
    "Wedding",
    "Housewarming",
    "Navratri",
    "Raksha Bandhan",
    "Holi",
    "Ganesh Chaturthi",
    "Sankranti",
    "Shivratri",
    "Ugadi",
    "Rama Navami",
    "Vaisakhi",
    "Janmashtami",
    "Onam",
    "Dussehra",
    "Chhath Puja"
  ].freeze

  REGIONS = %w[tamil-nadu gujarat punjab karnataka maharashtra kerala andhra-pradesh telangana west-bengal bihar assam odisha default].freeze

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true,
    format: { with: /\A[a-z0-9-]+\z/, message: "must be lowercase letters, numbers, and dashes" }
  validates :price, numericality: { greater_than_or_equal_to: 0 }
  validates :category, inclusion: { in: CATEGORIES }
  validates :region, inclusion: { in: REGIONS }, allow_blank: true

  before_validation :normalize_slug, if: -> { name.present? && slug.blank? }
  before_validation :coerce_array_columns
  before_validation :set_currency_default

  scope :featured, -> { where(featured: true) }
  scope :in_category, ->(category) { where(category: category) }
  scope :in_region, ->(region) { where(region: region) if region.present? }
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

  private

  def normalize_slug
    self.slug = name.to_s.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-+|-+$/, "")
  end

  ARRAY_COLUMNS = %i[images tags ritual_contents].freeze

  def coerce_array_columns
    ARRAY_COLUMNS.each do |col|
      value = public_send(col)
      next if value.nil? || value.is_a?(Array)
      self.public_send("#{col}=", split_array_string(value))
    end
  end

  def split_array_string(value)
    value.to_s.split(",").map(&:strip).reject(&:blank?)
  end

  def set_currency_default
    self.currency = "INR" if currency.blank?
  end
end
