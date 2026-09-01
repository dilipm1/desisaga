module ApplicationHelper
  include Pagy::Frontend
  def format_price(amount_cents, currency: "INR")
    return "" if amount_cents.nil?
    symbol = currency == "INR" ? "&#8377;".html_safe : currency.to_s.html_safe
    # amount is stored as paise (integer). Show paise only when non-zero, never .00
    has_paise = amount_cents % 100 != 0
    formatted = if has_paise
                  rupees = amount_cents / 100.0
                  # sprintf keeps 2 decimals (e.g., 2499.50 not 2499.5), number_with_delimiter handles commas
                  number_with_delimiter(sprintf("%.2f", rupees))
    else
                  rupees = amount_cents / 100
                  number_with_delimiter(rupees)
    end
    "#{symbol}#{formatted}".html_safe
  end

  # Convenience for forms: paise ↔ rupees (keeps 2 decimals when paise present)
  def price_in_rupees(cents)
    return "" if cents.nil?
    cents % 100 == 0 ? (cents / 100).to_s : sprintf("%.2f", cents / 100.0)
  end

  def category_emoji(category)
    {
      "Diwali" => "\u{1F56F}",
      "Puja" => "\u{1F64F}",
      "Wedding" => "\u{1F48D}",
      "Housewarming" => "\u{1F3E0}",
      "Navratri" => "\u{1F483}",
      "Raksha Bandhan" => "\u{1F380}",
      "Holi" => "\u{1F3A8}",
      "Ganesh Chaturthi" => "\u{1F418}",
      "Sankranti" => "\u2600",
      "Shivratri" => "\u{1F52F}",
      "Ugadi" => "\u{1F33F}",
      "Rama Navami" => "\u{1F3F9}",
      "Vaisakhi" => "\u{1F33E}",
      "Janmashtami" => "\u{1F425}",
      "Onam" => "\u{1F33C}",
      "Dussehra" => "\u{1F3F9}",
      "Chhath Puja" => "\u2600"
    }.fetch(category, "\u{1F381}")
  end

  def category_badge_class(category)
    {
      "Diwali" => "bg-amber-500/10 border-amber-400/30 text-amber-300",
      "Puja" => "bg-orange-500/10 border-orange-400/30 text-orange-300",
      "Wedding" => "bg-rose-500/10 border-rose-400/30 text-rose-300",
      "Housewarming" => "bg-emerald-500/10 border-emerald-400/30 text-emerald-300",
      "Navratri" => "bg-purple-500/10 border-purple-400/30 text-purple-300",
      "Raksha Bandhan" => "bg-pink-500/10 border-pink-400/30 text-pink-300",
      "Holi" => "bg-fuchsia-500/10 border-fuchsia-400/30 text-fuchsia-300",
      "Ganesh Chaturthi" => "bg-amber-500/10 border-amber-400/30 text-amber-300",
      "Sankranti" => "bg-yellow-500/10 border-yellow-400/30 text-yellow-300",
      "Shivratri" => "bg-slate-500/10 border-slate-400/30 text-slate-300",
      "Ugadi" => "bg-green-500/10 border-green-400/30 text-green-300",
      "Rama Navami" => "bg-orange-500/10 border-orange-400/30 text-orange-300",
      "Vaisakhi" => "bg-amber-500/10 border-amber-400/30 text-amber-300",
      "Janmashtami" => "bg-blue-500/10 border-blue-400/30 text-blue-300",
      "Onam" => "bg-yellow-500/10 border-yellow-400/30 text-yellow-300",
      "Dussehra" => "bg-red-500/10 border-red-400/30 text-red-300",
      "Chhath Puja" => "bg-orange-500/10 border-orange-400/30 text-orange-300"
    }.fetch(category, "bg-amber-500/10 border-amber-400/30 text-amber-300")
  end
end
