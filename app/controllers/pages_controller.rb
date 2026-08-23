class PagesController < ApplicationController
  def home
    @next_festival = Festivals.next_festival
    @featured_products = Product.featured.limit(4)
  end
end
