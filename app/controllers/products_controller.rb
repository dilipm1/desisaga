class ProductsController < ApplicationController
  def index
    @products = Product.order(:name)
    @products = @products.in_category(params[:category]) if params[:category].in?(Product::CATEGORIES)
    @products = @products.search(params[:q]) if params[:q].present?
    @selected_category = params[:category]
  end

  def show
    @product = Product.find_by_slug!(params[:slug])
  rescue ActiveRecord::RecordNotFound
    not_found
  end
end
