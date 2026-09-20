class PagesController < ApplicationController
  allow_unauthenticated_access

  def home
    @selected_region = params[:region]
    @next_festival = Festivals.next_festival(region: @selected_region)
    @featured_products = Product.featured.limit(4)
    @featured_products = @featured_products.where(region: @selected_region) if @selected_region.present?
  end

  def coming_soon; end

  def about; end
end
