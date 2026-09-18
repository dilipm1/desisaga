# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_09_10_000003) do
  create_table "buckets", force: :cascade do |t|
    t.bigint "bucketable_id"
    t.string "bucketable_type"
    t.datetime "created_at", null: false
    t.string "name", null: false
    t.datetime "updated_at", null: false
    t.index ["bucketable_type", "bucketable_id"], name: "index_buckets_on_bucketable_type_and_bucketable_id"
    t.index ["name"], name: "index_buckets_on_name", unique: true
  end

  create_table "product_recordables", force: :cascade do |t|
    t.string "category", null: false
    t.datetime "created_at", null: false
    t.string "currency", default: "INR"
    t.text "description"
    t.boolean "featured", default: false
    t.json "images"
    t.boolean "in_stock", default: true
    t.string "name", null: false
    t.integer "price", null: false
    t.string "region"
    t.json "ritual_contents"
    t.string "slug", null: false
    t.json "tags"
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_product_recordables_on_category"
    t.index ["slug"], name: "index_product_recordables_on_slug", unique: true
  end

  create_table "products", force: :cascade do |t|
    t.string "category"
    t.datetime "created_at", null: false
    t.string "currency"
    t.text "description"
    t.boolean "featured"
    t.json "images"
    t.boolean "in_stock"
    t.string "name"
    t.integer "price"
    t.string "region"
    t.json "ritual_contents"
    t.string "slug"
    t.json "tags"
    t.datetime "updated_at", null: false
    t.index ["category"], name: "index_products_on_category"
    t.index ["featured"], name: "index_products_on_featured"
    t.index ["region"], name: "index_products_on_region"
    t.index ["slug"], name: "index_products_on_slug", unique: true
  end

  create_table "recordings", force: :cascade do |t|
    t.integer "bucket_id", null: false
    t.datetime "created_at", null: false
    t.bigint "creator_id"
    t.integer "parent_id"
    t.integer "position"
    t.bigint "recordable_id", null: false
    t.string "recordable_type", null: false
    t.string "status", default: "active"
    t.datetime "updated_at", null: false
    t.index ["bucket_id", "recordable_type"], name: "index_recordings_on_bucket_id_and_recordable_type"
    t.index ["bucket_id"], name: "index_recordings_on_bucket_id"
    t.index ["parent_id"], name: "index_recordings_on_parent_id"
    t.index ["recordable_type", "recordable_id"], name: "index_recordings_on_recordable_type_and_recordable_id"
  end

  create_table "sessions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "ip_address"
    t.datetime "updated_at", null: false
    t.string "user_agent"
    t.integer "user_id", null: false
    t.index ["user_id"], name: "index_sessions_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email_address", null: false
    t.string "name"
    t.string "password_digest", null: false
    t.string "role"
    t.datetime "updated_at", null: false
    t.index ["email_address"], name: "index_users_on_email_address", unique: true
  end

  add_foreign_key "recordings", "buckets"
  add_foreign_key "recordings", "recordings", column: "parent_id"
  add_foreign_key "sessions", "users"
end
