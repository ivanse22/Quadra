-- QUADRA — Schema Supabase
-- Idempotente: seguro para re-ejecutar en cualquier momento.
-- Actualizado: abril 2026

-- Requisito: gen_random_uuid()
create extension if not exists pgcrypto;

-- ─────────────────────────────────────────────────────────────
-- 1) PROFILES
-- ─────────────────────────────────────────────────────────────
create table if not exists public.profiles (
  id             uuid      primary key references auth.users(id) on delete cascade,
  name           text,
  regimen        text      default 'ordinario',   -- 'simple' | 'ordinario' | 'unclear'
  tipo_ingreso   text      default 'honorarios',  -- 'honorarios' | 'servicios'
  es_declarante  boolean   default false,
  retencion      numeric   default 11,            -- % retención (3.5, 10, 11, custom)
  pila           text      default 'auto',        -- 'auto' | 'manual' | 'no'
  is_pila_exempt boolean   default false,         -- pensionados o doble cotización
  updated_at     timestamptz default now()
);

-- Columna nueva: agregar si la tabla ya existía sin ella
alter table public.profiles
  add column if not exists is_pila_exempt boolean default false;

alter table public.profiles enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='profiles'
      and policyname='Users manage own profile'
  ) then
    create policy "Users manage own profile"
      on public.profiles for all
      using (auth.uid() = id)
      with check (auth.uid() = id);
  end if;
end $$;

-- ─────────────────────────────────────────────────────────────
-- 2) PAYMENTS
-- ─────────────────────────────────────────────────────────────
-- id bigint = Date.now() generado en el cliente (JS)
-- date text  = 'YYYY-MM-DD' (sin conversión de zona horaria)
create table if not exists public.payments (
  id             bigint    primary key,
  user_id        uuid      references auth.users(id) on delete cascade,
  client         text,
  method         text,
  currency       text,
  original_amount numeric,
  gross          numeric,
  retencion      numeric,
  pila           numeric,
  reserva        numeric,
  disponible     numeric,
  date           text,
  date_label     text,
  type           text      default 'income',  -- 'income' | 'pila' | 'renta'
  period_label   text,
  created_at     timestamptz default now()
);

alter table public.payments enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='payments'
      and policyname='Users manage own payments'
  ) then
    create policy "Users manage own payments"
      on public.payments for all
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;
end $$;
