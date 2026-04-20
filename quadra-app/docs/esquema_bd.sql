-- 1. Crear tabla de Perfil (Profile) extendiendo la tabla native auth.users de Supabase
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  regimen TEXT,       -- 'simple' | 'ordinario' | 'unclear'
  retencion NUMERIC,  -- 3.5 | 11 | etc.
  pila TEXT,          -- 'auto' | 'manual' | 'no'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS (Row Level Security) para proteger la privacidad
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para profiles
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

-- 2. Crear tabla de Pagos (Payments)
CREATE TABLE public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client TEXT NOT NULL,
  type TEXT NOT NULL, -- 'income' | 'pila' | 'renta'
  method TEXT,        -- 'bank' | 'PSE' | etc.
  gross NUMERIC DEFAULT 0,
  pila NUMERIC DEFAULT 0,
  reserva NUMERIC DEFAULT 0,
  retencion NUMERIC DEFAULT 0,
  disponible NUMERIC DEFAULT 0,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para payments
CREATE POLICY "Users can view own payments" 
ON public.payments FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own payments" 
ON public.payments FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own payments" 
ON public.payments FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own payments" 
ON public.payments FOR DELETE 
USING (auth.uid() = user_id);
