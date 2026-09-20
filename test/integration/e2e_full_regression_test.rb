require "test_helper"

class E2EFullRegressionTest < ActionDispatch::IntegrationTest
  setup do
    @browser_headers = { "User-Agent" => "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36" }
    @product = products(:diwali_hamper)
    @admin = users(:one)
  end

  test "full end-to-end user and admin regression flow with ahoy and blazer" do
    # 1. Health check
    get "/up"
    assert_response :success

    # 2. Storefront Navigation
    get "/", headers: @browser_headers
    assert_response :success
    assert_select "h1"

    get "/products", headers: @browser_headers
    assert_response :success

    get "/products", params: { category: "Diwali" }, headers: @browser_headers
    assert_response :success

    get "/products", params: { region: "tamil-nadu" }, headers: @browser_headers
    assert_response :success

    assert_difference -> { Ahoy::Event.where(name: "product_viewed").count }, 1 do
      get "/products/#{@product.slug}", headers: @browser_headers
      assert_response :success
    end

    # 3. Add to Cart & Checkout Events
    assert_difference -> { Ahoy::Event.where(name: "add_to_cart").count }, 1 do
      post "/cart_items", params: { product_id: @product.id }, headers: @browser_headers
      assert_response :redirect
    end

    get "/cart", headers: @browser_headers
    assert_response :success

    assert_difference -> { Ahoy::Event.where(name: "checkout_started").count }, 1 do
      get "/checkout", headers: @browser_headers
      assert_response :success
    end

    assert_difference -> { Ahoy::Event.where(name: "order_placed").count }, 1 do
      post "/checkout", headers: @browser_headers
      assert_redirected_to checkout_success_path
    end

    get "/checkout/success", headers: @browser_headers
    assert_response :success

    # 4. Security & Access Control for Anonymous / Unauthenticated
    get "/admin/products"
    assert_redirected_to login_path

    get "/admin/blazer"
    assert_redirected_to "/login"

    # 5. Admin Authentication
    sign_in_as(@admin)

    # 6. Admin Panel CRUD
    get "/admin/products"
    assert_response :success
    assert_select "h1", /Inventory/i

    get "/admin/products/new"
    assert_response :success

    # 7. Blazer Analytics Dashboard & Query Executions
    get "/admin/blazer"
    assert_response :success

    # Seed starter blazer queries if in-memory test DB hasn't run seeds
    if Blazer::Query.count.zero?
      Blazer::Query.create!(name: "Test Daily Visits", statement: "SELECT date(started_at) AS day, count(*) AS visits FROM ahoy_visits GROUP BY 1 ORDER BY 1 DESC LIMIT 10;")
      Blazer::Query.create!(name: "Test Funnel", statement: "SELECT name, count(*) AS total_events FROM ahoy_events GROUP BY name ORDER BY total_events DESC;")
    end

    Blazer::Query.find_each do |query|
      res = Blazer.data_sources["main"].run_statement(query.statement)
      assert_nil res.error, "Blazer query '#{query.name}' failed with error: #{res.error}"
      assert res.rows.is_a?(Array), "Blazer query '#{query.name}' did not return rows"
    end

    # 8. Sign Out
    sign_out
    get "/admin/products"
    assert_redirected_to login_path

    get "/admin/blazer"
    assert_redirected_to "/login"

    # 9. Panchang Engine
    fest = Festivals.next_festival
    assert fest.present?
    assert fest[:festival]&.name.present? || fest[:name].present?
  end
end
