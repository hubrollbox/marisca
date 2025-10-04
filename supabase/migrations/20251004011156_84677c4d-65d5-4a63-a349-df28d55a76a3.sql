-- Create complaints table (Livro de Reclamações)
CREATE TABLE public.complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  complaint_type TEXT NOT NULL CHECK (complaint_type IN ('produto', 'entrega', 'atendimento', 'outro')),
  description TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'submetida' CHECK (status IN ('submetida', 'em_analise', 'resolvida', 'rejeitada')),
  submitted_to_authority BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Users can view their own complaints
CREATE POLICY "Users can view own complaints"
  ON public.complaints FOR SELECT
  USING (auth.uid() = user_id OR email = (auth.jwt() ->> 'email'));

-- Anyone can submit a complaint (including guests)
CREATE POLICY "Anyone can submit complaints"
  ON public.complaints FOR INSERT
  WITH CHECK (true);

-- Admins can view and manage all complaints
CREATE POLICY "Admins can manage complaints"
  ON public.complaints FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Function to generate complaint number
CREATE OR REPLACE FUNCTION public.generate_complaint_number()
RETURNS TEXT AS $$
DECLARE
  year TEXT;
  sequence_number INT;
  complaint_number TEXT;
BEGIN
  year := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COUNT(*) + 1 INTO sequence_number
  FROM public.complaints
  WHERE TO_CHAR(created_at, 'YYYY') = year;
  
  complaint_number := 'LR-' || year || '-' || LPAD(sequence_number::TEXT, 6, '0');
  
  RETURN complaint_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-generate complaint number
CREATE OR REPLACE FUNCTION public.set_complaint_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.complaint_number IS NULL OR NEW.complaint_number = '' THEN
    NEW.complaint_number := public.generate_complaint_number();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER set_complaint_number_trigger
  BEFORE INSERT ON public.complaints
  FOR EACH ROW EXECUTE FUNCTION public.set_complaint_number();