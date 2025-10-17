-- Add stripe_session_id to orders and index for efficient lookups
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS stripe_session_id TEXT;

-- Backfill existing session IDs mistakenly stored in stripe_payment_intent_id
UPDATE public.orders
SET stripe_session_id = stripe_payment_intent_id
WHERE stripe_session_id IS NULL AND stripe_payment_intent_id IS NOT NULL;

-- Create index to speed up webhook and success page queries
CREATE INDEX IF NOT EXISTS idx_orders_stripe_session_id ON public.orders(stripe_session_id);