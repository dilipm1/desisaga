module Festivals
  Festival = Struct.new(:id, :name, :date, :ritual, :items, :category, keyword_init: true)

  DATED_FESTIVALS = [
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

  def next_festival(from: Date.current)
    DATED_FESTIVALS.each do |festival|
      remaining = days_left(festival.date, from: from)
      return { festival: festival, days_left: remaining } if remaining >= 0
    end
    nil
  end
end
