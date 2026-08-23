class CartsController < ApplicationController
  def show
  end

  def destroy
    session[:cart] = {}
    redirect_to cart_path, notice: "Cart cleared."
  end
end
