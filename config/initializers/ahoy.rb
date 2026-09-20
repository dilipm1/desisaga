class Ahoy::Store < Ahoy::DatabaseStore
end

# Track visits server-side (no JS beacon needed — works with Turbo)
Ahoy.api = false
Ahoy.server_side_visits = true

# Cookie-based visitor tracking (first-party, no consent banner required)
Ahoy.cookie_options = { same_site: :lax }

# Mask IPs for privacy (GDPR / India DPDP friendly)
Ahoy.mask_ips = true

# No geocoding at MVP — add geocoder gem later if needed
Ahoy.geocode = false

# Track bots? No — keeps data clean
Ahoy.track_bots = false
