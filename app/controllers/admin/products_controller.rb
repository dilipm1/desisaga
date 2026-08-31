class Admin::ProductsController < Admin::BaseController
  before_action :set_product, only: %i[show edit update destroy]

  def index
    @pagy, @products = pagy(Product.order(:name), limit: 20)
  rescue Pagy::OverflowError
    @pagy, @products = pagy(Product.order(:name), limit: 20, page: 1)
  end

  def show
    redirect_to edit_admin_product_path(@product)
  end

  def new
    @product = Product.new(currency: "INR", in_stock: true)
  end

  def create
    @product = Product.new(product_params)
    if @product.save
      redirect_to admin_products_path, notice: "Product added."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      redirect_to admin_products_path, notice: "Product updated."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy!
    redirect_to admin_products_path, notice: "Product deleted.", status: :see_other
  end

  private
    def set_product
      @product = Product.find_by!(slug: params[:id])
    end

    def product_params
      params.require(:product).permit(
        :name, :slug, :description, :price, :category, :region, :in_stock, :featured,
        :images, :tags, :ritual_contents
      )
    end
end
