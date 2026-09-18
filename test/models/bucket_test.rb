require "test_helper"

class BucketTest < ActiveSupport::TestCase
  test "requires unique name" do
    Bucket.create!(name: "shop")
    assert_not Bucket.new(name: "shop").valid?
  end

  test "has many recordings" do
    bucket = Bucket.create!(name: "region-tamil-nadu")
    pr = ProductRecordable.create!(name: "Pongal Hamper", slug: "pongal-hamper", price: 199900, category: "Sankranti", region: "tamil-nadu")
    rec = bucket.recordings.create!(recordable: pr)
    assert_equal 1, bucket.recordings.count
    assert_equal bucket, rec.bucket
  end
end
