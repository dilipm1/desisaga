require "test_helper"

class RecordingTest < ActiveSupport::TestCase
  test "delegates to product recordable and scopes via bucket" do
    bucket = Bucket.create!(name: "test-shop")
    pr = ProductRecordable.create!(name: "Diwali Test Hamper", slug: "diwali-test-hamper", price: 249900, category: "Diwali")
    rec = Recording.create!(bucket: bucket, recordable: pr)
    assert_equal pr, rec.recordable
    assert_equal "ProductRecordable", rec.recordable_type
    assert_includes bucket.recordings, rec
  end

  test "requires recordable" do
    bucket = Bucket.create!(name: "test-shop-2")
    assert_not Recording.new(bucket: bucket).valid?
  end
end
