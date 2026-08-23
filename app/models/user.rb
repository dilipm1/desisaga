class User < ApplicationRecord
  has_secure_password
  has_many :sessions, dependent: :destroy

  normalizes :email_address, with: ->(e) { e.strip.downcase }

  def admin?
    role == "admin" || email_address == ENV.fetch("ADMIN_EMAIL", "admin@desisaga.com")
  end

  def display_name
    name.presence || email_address
  end
end
