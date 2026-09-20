require "test_helper"

class AnalyticsTest < ActionDispatch::IntegrationTest
  setup do
    @product = products(:diwali_hamper)
  end

  test "tracks product_viewed event when visiting product show" do
    assert_difference "Ahoy::Event.where(name: 'product_viewed').count", 1 do
      get product_path(@product), headers: { "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    end
    assert_response :success

    event = Ahoy::Event.where(name: "product_viewed").last
    assert_equal @product.id, event.properties["product_id"]
    assert_equal @product.name, event.properties["name"]
  end

  test "tracks add_to_cart event on cart_items create" do
    assert_difference "Ahoy::Event.where(name: 'add_to_cart').count", 1 do
      post cart_items_path,
        params: { product_id: @product.id },
        headers: { "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    end

    event = Ahoy::Event.where(name: "add_to_cart").last
    assert_equal @product.id, event.properties["product_id"]
  end

  test "blazer route redirects unauthorized users to login" do
    get "/admin/blazer"
    assert_redirected_to "/login"
  end
end
