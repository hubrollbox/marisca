-- Add extra product detail fields to products table
-- These are optional text fields for richer product info

ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS scientific_name text;

ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS origin text;

ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS ideal_conservation text;

ALTER TABLE IF EXISTS public.products
  ADD COLUMN IF NOT EXISTS consumption_suggestion text;