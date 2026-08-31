class ApplicationController < ActionController::Base
  include Pagy::Backend
  # Only allow modern browsers supporting webp images, web push, badges, import maps, CSS nesting, and CSS :has.
  allow_browser versions: :modern

  # Changes to the importmap will invalidate the etag for HTML responses
  stale_when_importmap_changes

  helper_method :current_user, :authenticated?, :cart_items, :cart_subtotal, :cart_count, :shipping_for

  private
    def current_user
      return nil unless cookies.signed[:session_id]
      Current.session ||= Session.find_by(id: cookies.signed[:session_id])
      Current.session&.user
    end

    def authenticated?
      current_user.present?
    end

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
      subtotal.zero? || subtotal >= 999 ? 0 : 99
    end

    def add_to_cart(product_id, quantity = 1)
      cart[product_id.to_s] = cart[product_id.to_s].to_i + quantity
    end

    def not_found
      render "errors/not_found", status: :not_found
    end
end
