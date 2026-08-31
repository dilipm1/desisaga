class ProductsController < ApplicationController
  def index
    sort = params[:sort].in?(%w[name price price.desc]) ? params[:sort] : "name"
    order_sql = case sort
    when "name"       then "name ASC"
    when "price"      then "price ASC"
    when "price.desc" then "price DESC"
    end
    scope = Product.order(Arel.sql(order_sql))
    scope = scope.in_category(params[:category]) if params[:category].in?(Product::CATEGORIES)
    scope = scope.in_region(params[:region]) if params[:region].present? && params[:region].in?(Product::REGIONS)
    scope = scope.search(params[:q]) if params[:q].present?
    @pagy, @products = pagy(scope, limit: 12)
    @selected_category = params[:category]
    @selected_region = params[:region]
    @selected_sort = sort
  rescue Pagy::OverflowError
    @pagy, @products = pagy(scope, limit: 12, page: 1)
  end

  def show
    @product = Product.find_by_slug!(params[:slug])
  rescue ActiveRecord::RecordNotFound
    not_found
  end
end
