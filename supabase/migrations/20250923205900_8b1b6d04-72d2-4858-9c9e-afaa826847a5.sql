-- Create enum for order status
CREATE TYPE public.order_status AS ENUM ('pendente', 'confirmado', 'preparado', 'em_entrega', 'entregue', 'cancelado');

-- Create enum for product state
CREATE TYPE public.product_state AS ENUM ('CRU', 'COZIDO');

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  weight TEXT,
  available BOOLEAN NOT NULL DEFAULT true,
  states product_state[] NOT NULL DEFAULT '{CRU}',
  prep_time TEXT,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create addresses table
CREATE TABLE public.addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  street TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  guest_email TEXT,
  status order_status NOT NULL DEFAULT 'pendente',
  total_amount DECIMAL(10,2) NOT NULL,
  delivery_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_address JSONB NOT NULL,
  delivery_time_slot TEXT,
  notes TEXT,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  state product_state NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Products policies (public read, admin write)
CREATE POLICY "Anyone can view available products" ON public.products
  FOR SELECT USING (available = true);

-- Addresses policies
CREATE POLICY "Users can manage their addresses" ON public.addresses
  FOR ALL USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view their own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id OR guest_email = auth.jwt()->>'email');
CREATE POLICY "Users can create orders" ON public.orders
  FOR INSERT WITH CHECK (auth.uid() = user_id OR guest_email IS NOT NULL);
CREATE POLICY "Users can update their pending orders" ON public.orders
  FOR UPDATE USING ((auth.uid() = user_id OR guest_email = auth.jwt()->>'email') AND status = 'pendente');

-- Order items policies
CREATE POLICY "Users can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.guest_email = auth.jwt()->>'email')
    )
  );
CREATE POLICY "Users can create order items for their orders" ON public.order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders 
      WHERE orders.id = order_items.order_id 
      AND (orders.user_id = auth.uid() OR orders.guest_email IS NOT NULL)
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample products data
INSERT INTO public.products (name, description, price, image_url, weight, available, states, prep_time, stock) VALUES
('Lagosta Fresca', 'Lagosta fresca capturada hoje na costa portuguesa. Ideal para uma refeição especial.', 45.90, '/src/assets/lobster.jpg', '400-500g', true, '{CRU,COZIDO}', '20-25 min', 10),
('Camarões Tigre', 'Camarões tigre frescos de primeira qualidade, perfeitos para grelhar ou cozer.', 24.50, '/src/assets/prawns.jpg', '500g', true, '{CRU,COZIDO}', '10-15 min', 15),
('Mexilhões da Ria', 'Mexilhões frescos da Ria de Aveiro, ideais para cataplana ou à bulhão pato.', 8.90, '/src/assets/mussels.jpg', '1kg', true, '{CRU}', '8-10 min', 20),
('Santola Inteira', 'Santola fresca inteira, uma iguaria da gastronomia portuguesa.', 32.50, '/src/assets/lobster.jpg', '800g-1kg', false, '{CRU,COZIDO}', '25-30 min', 0),
('Lingueirão', 'Lingueirão fresco da costa alentejana, perfeito para grelhar na chapa.', 18.90, '/src/assets/mussels.jpg', '500g', true, '{CRU}', '5-8 min', 12),
('Polvinho Baby', 'Polvinho baby fresco e tenro, ideal para saladas ou à lagareiro.', 22.90, '/src/assets/prawns.jpg', '400g', true, '{CRU,COZIDO}', '15-20 min', 8),
('Sapateira Pequena', 'Sapateira pequena fresca, cheia de sabor do mar português.', 15.90, '/src/assets/lobster.jpg', '300-400g', true, '{CRU,COZIDO}', '20 min', 14),
('Amêijoas Japonesas', 'Amêijoas japonesas frescas, perfeitas para cataplana ou à bulhão pato.', 12.50, '/src/assets/mussels.jpg', '500g', true, '{CRU}', '5-10 min', 18),
('Gamba Vermelha', 'Gamba vermelha premium da costa portuguesa, uma verdadeira delícia.', 38.90, '/src/assets/prawns.jpg', '300g', true, '{CRU}', '8-12 min', 6),
('Berbigão', 'Berbigão fresco da costa atlântica, ideal para acompanhar uma boa francesinha.', 9.90, '/src/assets/mussels.jpg', '750g', false, '{CRU}', '5-8 min', 0);