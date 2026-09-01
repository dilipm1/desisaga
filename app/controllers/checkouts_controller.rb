class CheckoutsController < ApplicationController
  before_action :require_cart_items, only: %i[show create]

  def show
  end

  # Stripe test-mode placeholder — real payments come later.
  def create
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
