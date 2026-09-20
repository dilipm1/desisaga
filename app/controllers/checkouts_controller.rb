class CheckoutsController < ApplicationController
  allow_unauthenticated_access
  before_action :require_cart_items, only: %i[show create]

  def show
    ahoy.track "checkout_started", { item_count: cart_count, subtotal: cart_subtotal }
  end

  # Stripe test-mode placeholder — real payments come later.
  def create
    ahoy.track "order_placed", { item_count: cart_count, subtotal: cart_subtotal }
    session[:cart] = {}
    redirect_to checkout_success_path
  end

  def success
  end

  private
    def require_cart_items
      if cart_items.empty?
        redirect_to products_path, alert: "Your cart is empty — add a hamper first."
      end
    end
end
