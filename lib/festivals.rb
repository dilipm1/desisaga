require_relative "panchang_calculator"

module Festivals
  Festival = Struct.new(:id, :name, :date, :ritual, :items, :category, keyword_init: true) do
    attr_accessor :variant, :base_id
  end

  # Legacy static list (kept for fallback & tests) — now superseded by PanchangCalculator
  # Single source of truth is data/festivals_generated_2026_2030.json (Lahiri, Option B)
  LEGACY_DATED = [
    Festival.new(
      id: "raksha-bandhan",
      name: "Raksha Bandhan",
      date: "2026-08-28",
      ritual: "The rakhi you tie for a sibling",
      items: [ "rakhi", "roli-chawal", "sweets", "a card in your words" ],
      category: "Raksha Bandhan"
    ),
    Festival.new(
      id: "ganesh-chaturthi",
      name: "Ganesh Chaturthi",
      date: "2026-09-14",
      ritual: "Welcoming Bappa home",
      items: [ "eco idol", "modak", "durva grass", "aarti book" ],
      category: "Ganesh Chaturthi"
    ),
    Festival.new(
      id: "navratri",
      name: "Navratri",
      date: "2026-10-11",
      ritual: "Nine nights of the goddess",
      items: [ "dandiya", "chunri", "puja samagri", "Durga idol" ],
      category: "Navratri"
    ),
    Festival.new(
      id: "diwali",
      name: "Diwali",
      date: "2026-11-08",
      ritual: "The festival of lights",
      items: [ "clay diyas", "rangoli", "sweets box", "aarti thali" ],
      category: "Diwali"
    ),
    Festival.new(
      id: "holi",
      name: "Holi",
      date: "2027-03-22",
      ritual: "The festival of colours",
      items: [ "organic gulaal", "gujiya", "thandai mix" ],
      category: "Holi"
    )
  ].freeze

  # Dynamic dated list from own Panchang logic (Option B table)
  def self.build_dated_for(year, region: nil)
    PanchangCalculator.all_for_year(year).map do |h|
      # pick regional alias if requested
      variant = if region
                  h["variants"]&.find { |v| v["region"] == region.to_s || v["state_code"] == region.to_s.upcase } || h["variants"]&.first
      else
                  h["variants"]&.find { |v| v["region"] == "default" } || h["variants"]&.first
      end
      date = variant && variant["observation_date_override"]&.[](year.to_s) || h["date"]
      Festival.new(
        id: h["id"],
        name: variant ? variant["alias"] : h["base_name"],
        date: date,
        ritual: variant ? variant["ritual"] : h["base_name"],
        items: variant ? variant["items"] : [],
        category: h["category"]
      ).tap do |f|
        f.variant = variant
        f.base_id = h["id"]
      end
    end
  end

  # Public constant now delegates to calculator for current + next year (sorted)
  # Keeps backward compat for `Festivals::DATED_FESTIVALS`
  def self.dated_festivals(region: nil, from: Date.current)
    years = [ from.year, from.year + 1 ]
    years.flat_map { |y| build_dated_for(y, region: region) }
         .select { |f| f.date.present? }
         .sort_by { |f| f.date }
  end

  DATED_FESTIVALS = LEGACY_DATED
  # For historical code that iterates DATED_FESTIVALS directly, we provide a method
  # that returns the dynamic list: `Festivals.dated` — views should migrate to it
  def self.dated(region: nil, from: Date.current)
    dated_festivals(region: region, from: from)
  end

  ANYTIME_RITUALS = [
    Festival.new(
      id: "wedding",
      name: "Wedding",
      date: "",
      ritual: "A shagun for the couple",
      items: [ "mangalsutra", "sindoor", "shagun envelope" ],
      category: "Wedding"
    ),
    Festival.new(
      id: "housewarming",
      name: "Housewarming",
      date: "",
      ritual: "Aashirwad for the new home",
      items: [ "Ganesh idol", "kalash", "coconut", "toran" ],
      category: "Housewarming"
    ),
    Festival.new(
      id: "puja",
      name: "Puja",
      date: "",
      ritual: "A thali for everyday worship",
      items: [ "brass thali", "camphor", "kumkum", "puja guide" ],
      category: "Puja"
    )
  ].freeze

  module_function

  def days_left(date, from: Date.current)
    return 999_999 if date.blank?
    (Date.parse(date) - from).to_i
  end

  def format_date_label(date)
    d = Date.parse(date)
    d.strftime("%-d %b")
  end

  def next_festival(from: Date.current, region: nil)
    # Own Panchang logic (Option B table) with year wrap + region alias
    result = PanchangCalculator.next_festival(from: from, region: region)
    return result if result

    # Fallback to legacy static list
    DATED_FESTIVALS.each do |festival|
      remaining = days_left(festival.date, from: from)
      return { festival: festival, days_left: remaining } if remaining >= 0
    end
    nil
  end

  # Convenience for calendar: all dated for current view year (region-aware)
  def dated_for_year(year, region: nil)
    build_dated_for(year, region: region)
  end
end
