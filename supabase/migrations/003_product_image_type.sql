-- ============================================
-- Madcap Tees — Image type for product_images
-- Run after 002_storage_bucket.sql
--
-- Lets one product carry several shots:
--   design = the artwork on its own (square block on the shop grid)
--   model  = a person wearing the tee (leads the product page gallery)
--   flat   = the garment mockup on its own
-- Existing rows default to 'flat', so nothing changes until a
-- design/model image is uploaded.
-- ============================================

ALTER TABLE product_images
  ADD COLUMN IF NOT EXISTS image_type text NOT NULL DEFAULT 'flat'
  CHECK (image_type IN ('design', 'model', 'flat'));
