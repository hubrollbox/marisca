-- Prevent customers from changing payment_status or other order fields directly.
-- Payment state changes must be performed by the Stripe webhook/service role or an authorized admin.
DROP POLICY IF EXISTS "Users can update their pending orders" ON public.orders;
