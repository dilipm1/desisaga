class ApplicationController < ActionController::Base
  include Authentication
  include Pagy::Backend
  include Ahoy::Controller

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  helper_method :cart_items, :cart_subtotal, :cart_count, :shipping_for

  def not_found
    render "errors/not_found", status: :not_found
  end

  # Used by blazer.yml before_action_method — must live in ApplicationController
  # so Blazer::QueriesController (which inherits from it) can find it
  def require_blazer_access
    redirect_to "/login", alert: "Admin access only." unless current_user&.admin?
  end

  private
    def cart
      session[:cart] ||= {}
    end

    def cart_items
      cart.filter_map do |product_id, quantity|
        product = Product.find_by(id: product_id)
        next unless product
        CartItem.new(product: product, quantity: quantity)
      end
    end

    def cart_count
      cart.values.sum
    end

    def cart_subtotal
      cart_items.sum(&:line_total)
    end

    def shipping_for(subtotal)
      subtotal.zero? || subtotal >= 99_900 ? 0 : 9_900
    end

    def add_to_cart(product_id, quantity = 1)
      cart[product_id.to_s] = cart[product_id.to_s].to_i + quantity
    end
end
