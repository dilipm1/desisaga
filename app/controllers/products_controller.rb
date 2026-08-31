class ProductsController < ApplicationController
  def index
    sort = params[:sort].in?(%w[name price price.desc]) ? params[:sort] : "name"
    order_sql = case sort
    when "name"       then "name ASC"
    when "price"      then "price ASC"
    when "price.desc" then "price DESC"
    end
    @products = Product.order(Arel.sql(order_sql))
    @products = @products.in_category(params[:category]) if params[:category].in?(Product::CATEGORIES)
    @products = @products.search(params[:q]) if params[:q].present?
    @selected_category = params[:category]
    @selected_sort = sort
  end

  def show
    @product = Product.find_by_slug!(params[:slug])
  rescue ActiveRecord::RecordNotFound
    not_found
  end
end
