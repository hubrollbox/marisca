-- Create partnership_requests table
CREATE TABLE public.partnership_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  partnership_type TEXT NOT NULL CHECK (partnership_type IN ('gastronomia', 'desporto', 'cultura', 'outro')),
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_analise', 'aprovado', 'rejeitado')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;

-- Admins can view all requests
CREATE POLICY "Admins can view partnership requests"
  ON public.partnership_requests FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Anyone can submit a request (including guests)
CREATE POLICY "Anyone can submit partnership requests"
  ON public.partnership_requests FOR INSERT
  WITH CHECK (true);

-- Admins can update requests
CREATE POLICY "Admins can update partnership requests"
  ON public.partnership_requests FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_partnership_requests_updated_at
  BEFORE UPDATE ON public.partnership_requests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();