class CartItemsController < ApplicationController
  allow_unauthenticated_access

  def create
    product = Product.find(params[:product_id])
    add_to_cart(product.id)
    ahoy.track "add_to_cart", {
      product_id: product.id,
      name: product.name,
      category: product.category,
      region: product.region,
      price: product.price
    }
    redirect_back fallback_location: product_path(product), notice: "#{product.name} added to your cart."
  rescue ActiveRecord::RecordNotFound
    redirect_to products_path, alert: "Product not found."
  end

  def update
    quantity = params[:quantity].to_i
    if quantity < 1
      destroy_and_redirect
    else
      cart[params[:id]] = quantity
      redirect_to cart_path
    end
  end

  def destroy
    destroy_and_redirect
  end

  private
    def destroy_and_redirect
      cart.delete(params[:id])
      redirect_to cart_path, status: :see_other
    end
end
