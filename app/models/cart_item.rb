class CartItem
  include ActiveModel::Model

  attr_accessor :product, :quantity

  delegate :id, :name, :slug, :price, :category, :primary_image, to: :product

  def line_total
    product.price * quantity
  end
end
