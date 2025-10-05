-- Function to decrease product stock
CREATE OR REPLACE FUNCTION public.decrease_product_stock(
  product_id UUID,
  quantity INT
)
RETURNS VOID AS $$
BEGIN
  UPDATE public.products
  SET stock = GREATEST(COALESCE(stock, 0) - quantity, 0),
      updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;