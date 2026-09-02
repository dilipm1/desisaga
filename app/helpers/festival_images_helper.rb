module FestivalImagesHelper
  CONFIG_PATH = Rails.root.join("config/festival_images.yml")

  def festival_image_for(category, region: nil)
    cfg = self.class.festival_images_config
    # region override (future) else category else default
    cfg.dig("regions", category, region) ||
      cfg.dig("festivals", category) ||
      cfg["default"]
  end

  def self.festival_images_config
    @festival_images_config ||= YAML.load_file(CONFIG_PATH)
  end

  def self.image_for(category, region: nil)
    cfg = festival_images_config
    cfg.dig("regions", category, region) ||
      cfg.dig("festivals", category) ||
      cfg["default"]
  end
end
