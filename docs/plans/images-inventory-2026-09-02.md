# Images Inventory Plan — 2026-09-02

## Problem
Landing hero for Janmashtami used `pexels 236149` (child with microphone) — AI slop, not ritual. Same pattern risks other festivals: generic stock that doesn't show makhan handi / flute / peacock, diya, rangoli etc. Hard-coded hash in `_festival_hero_image.html.erb:5` means product `images` in `db/seeds.rb` drift from hero.

## Immediate fix (shipped 2026-09-02)
- Central source: `config/festival_images.yml:1` (category → CDN URL + default fallback). `app/helpers/festival_images_helper.rb:1` singleton loader `FestivalImagesHelper.image_for(category)`.
- Hero partial now delegates to helper (`app/views/shared/_festival_hero_image.html.erb:1`), not inline hash.
- `app/models/product.rb:50` `primary_image` falls back to category image from same yml (so empty `images` never shows generic diya for Janmashtami).
- Fixed: `Janmashtami 236149 → 1448136` (Hindu deity / makhan handi — ritual-correct) in both yml and `db/seeds.rb:249`. Verify `curl -I 1448136` 200.
- Rule added in yml header: image MUST depict samagri (matki, peacock, flute) — quarterly review.

## Long plan — Inventory-managed images (part of Majestic / EPIC-6)

### Why tie to inventory
Festival image is a **recordable** property — same lifecycle as product: created, versioned, bucket-scoped (region variant: Thai Pongal vs Uttarayan want different hero), event-logged. Treating it as code hash loses this.

### Design (delegated types ready)
- **Storage**: Enable ActiveStorage (`bin/rails active_storage:install`) — local disk on existing volume `desisaga_storage:/rails/storage` (`config/storage.yml: local`). No new infra; works on Hetzner CX23 `nbg1`. Later swap to S3/Cloudflare R2 by changing `service` without code.
- **Model**:
  ```ruby
  class Product < ApplicationRecord
    has_many_attached :photos # new, keep `images` JSON as legacy fallback until migrated
    has_one_attached :hero_image # optional per-product hero crop
  end
  class FestivalImage < ApplicationRecord # optional, or reuse Product recordable
    belongs_to :bucket, optional: true # region variant hero
    has_one_attached :image
    validates :category, inclusion: Product::CATEGORIES
  end
  ```
  Interim: `Product#primary_image` prefers `photos.attached? ? url_for(photos.first) : images.first || FestivalImagesHelper.image_for(category)` — no break for existing 23 hampers.

- **Admin**:
  - `app/views/admin/products/_form.html.erb`: `f.file_field :photos, multiple: true, accept: "image/*"` + preview + `photos.purge` checkbox. Keep `images` text fallback hidden behind toggle.
  - `Admin::ProductsController#create/update`: permit `photos: []`, `authenticity` unchanged.
  - `app/views/admin/festival_images` (new, optional): CRUD per `category` + `region` hero override, single image per bucket.

- **Hero**: `FestivalImagesHelper.image_for` first checks `FestivalImage.find_by(category:, region:)` attached, else yml fallback — so ritual team can swap without deploy.

- **Migration**: rake `images:attach_legacy` downloads each `images` URL via `URI.open` and attaches; idempotent. Seeds remain fallback for fresh DB.

- **Ritual accuracy gate**:
  - Checklist in PR template: image shows listed `ritual_contents` (e.g., Janmashtami: makhan + handi + flute/peacock).
  - Quarterly audit: grep `festival_images.yml` vs `db/seeds.rb` ritual_contents desync.

- **Effort**: ~1 cycle (2 weeks) after DS-601/602. No Stripe dependency. Cost: local disk ~500MB for 23+ variants (negligible on 40GB CX23).

### Alternatives considered
- **Keep CDN only**: cheap but no ownership, hotlink risk, no variant hero, no versioning.
- **Immediate S3**: overkill for MVP, adds egress cost; local → S3 later is one-line.

### Next steps
1. Fix now (done) → redeploy.
2. Groom DS-107 `FestivalImages` into EPIC-2 (ritual accuracy) or EPIC-6 (recordable).
3. When prioritized: `active_storage:install` + admin upload + `primary_image` branch + migrate rake.
