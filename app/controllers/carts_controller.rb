class CartsController < ApplicationController
  allow_unauthenticated_access

  def show
  end

  def destroy
    session[:cart] = {}
    redirect_to cart_path, notice: "Cart cleared."
  end
end
