# PanchangCalculator — Option B: pre-computed table (Lahiri) + Meeus scaffolding
# Own logic: generated JSON for 2026-2030 cross-checked against Drik Panchang
# Future: replace table lookup with live solar/lunar computation
require "json"
require "date"

module PanchangCalculator
  TABLE_PATH = Rails.root.join("data/festivals_generated_2026_2030.json")
  AYANAMSA_DEFAULT = "Lahiri"

  class << self
    def table
      @table ||= JSON.parse(File.read(TABLE_PATH))
    rescue => e
      Rails.logger.warn("[PanchangCalculator] failed to load table: #{e.message}") if defined?(Rails.logger)
      { "festivals" => [] }
    end

    def festivals
      table["festivals"] || []
    end

    def find_base(id)
      festivals.find { |f| f["id"] == id.to_s }
    end

    def date_for(base_id, year)
      base = find_base(base_id)
      return nil unless base
      base["dates"][year.to_s]
    end

    def transit_for(base_id, year)
      base = find_base(base_id)
      return nil unless base
      base["transits"]&.[](year.to_s)
    end

    def variants_for(base_id)
      base = find_base(base_id)
      return [] unless base
      base["variants"] || []
    end

    # Observation date for a base or variant — currently table-driven
    # If variant has date_override in future, respect it; else base date
    def observation_date(base_id, year, region: nil)
      base = find_base(base_id)
      return nil unless base
      # variant override path (for future edge-year splits like Sankranti Jan 14 vs 15)
      if region
        variant = base["variants"]&.find { |v| v["region"] == region.to_s || v["state_code"] == region.to_s.upcase }
        if variant && variant["observation_date_override"]&.[](year.to_s)
          return variant["observation_date_override"][year.to_s]
        end
      end
      date_for(base_id, year)
    end

    # All dated observations for a given Gregorian year (used for calendar)
    # Returns array of hashes: { id, base_name, category, date, variants }
    def all_for_year(year)
      festivals.map do |f|
        date = f["dates"][year.to_s]
        next if date.nil? || date.empty?
        {
          "id" => f["id"],
          "base_name" => f["base_name"],
          "category" => f["category"],
          "type" => f["type"],
          "date" => date,
          "transit" => f["transits"]&.[](year.to_s),
          "variants" => f["variants"] || []
        }
      end.compact.sort_by { |h| h["date"] }
    end

    # Cross-year list for countdown (e.g., from 2026-08-31 need to wrap to 2027)
    # Collect current year + next year, sort, find next >= from
    def next_festival(from: Date.current, region: nil)
      years = [ from.year, from.year + 1 ]
      candidates = years.flat_map do |y|
        festivals.filter_map do |f|
          date_str = observation_date(f["id"], y, region: region)
          next if date_str.nil? || date_str.empty?
          date = Date.parse(date_str)
          next if date.nil?
          # expand variants as separate candidates if they have distinct hampers
          # For now return base festival with variants attached
          { base: f, date: date, date_str: date_str, region: region }
        end
      end.sort_by { |c| c[:date] }

      candidates.each do |c|
        remaining = (c[:date] - from).to_i
        if remaining >= 0
          base = c[:base]
          # pick most relevant variant for region or default
          variant = if region
                      base["variants"]&.find { |v| v["region"] == region.to_s } || base["variants"]&.first
          else
                      base["variants"]&.find { |v| v["region"] == "default" } || base["variants"]&.first
          end
          festival_struct = Festivals::Festival.new(
            id: base["id"],
            name: variant ? variant["alias"] : base["base_name"],
            date: c[:date_str],
            ritual: variant ? variant["ritual"] : base["base_name"],
            items: variant ? variant["items"] : [],
            category: base["category"]
          )
          # attach variant metadata for calendar/hamper linking
          festival_struct.instance_variable_set(:@variant, variant)
          festival_struct.instance_variable_set(:@base_id, base["id"])
          def festival_struct.variant; @variant; end
          def festival_struct.base_id; @base_id; end
          return { festival: festival_struct, days_left: remaining, region: region, base_id: base["id"] }
        end
      end
      nil
    end

    # Validation helper: compare table vs live Drik would go here
    def verify_against_table(base_id, year, expected_date)
      actual = date_for(base_id, year)
      actual == expected_date
    end

    # --- Meeus scaffolding (future live compute) ---
    # These are stubs that will be filled with solar longitude / tithi logic.
    # Currently they delegate to table, but signature is ready for swap.

    def solar_longitude(jd, ayanamsa: AYANAMSA_DEFAULT)
      # TODO: Meeus Ch. 25 + Lahiri ayanamsa correction
      # For now return nil to indicate table fallback
      nil
    end

    def tithi_at_sunrise(date, ayanamsa: AYANAMSA_DEFAULT)
      # TODO: Moon elongation - Sun elongation /12
      nil
    end

    def sankranti_observation(year, sankranti_name)
      # TODO: compute Sun 270° ingress + sunset rule
      date_for(sankranti_name, year)
    end
  end
end
