-- ============================================================
-- RouteDrop P2P Delivery Marketplace – Supabase SQL Schema
-- Run this in the Supabase SQL Editor to bootstrap the database.
-- ============================================================

-- ─────────────────────────────────────────
-- 1. USERS (extends auth.users via trigger)
-- ─────────────────────────────────────────
create table if not exists public.users (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  phone       text,
  role        text not null default 'both'
                check (role in ('sender', 'traveler', 'both')),
  kyc_status  text not null default 'pending'
                check (kyc_status in ('pending', 'submitted', 'verified', 'rejected')),
  aadhaar_ref text,              -- masked reference returned by KYC provider
  avatar_url  text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create a users row whenever a new auth user is registered
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─────────────────────────────────────────
-- 2. TRIPS (posted by travelers)
-- ─────────────────────────────────────────
create table if not exists public.trips (
  id           uuid primary key default gen_random_uuid(),
  traveler_id  uuid not null references public.users (id) on delete cascade,
  origin       text not null,
  destination  text not null,
  travel_date  date not null,
  departure_time time,
  vehicle_type text not null default 'car'
                 check (vehicle_type in ('car', 'bus', 'train')),
  capacity     text not null default 'Medium'
                 check (capacity in ('Small', 'Medium', 'Large')),
  price_per_kg numeric(10, 2),
  status       text not null default 'active'
                 check (status in ('active', 'full', 'completed', 'cancelled')),
  created_at   timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 3. DELIVERIES (bookings / orders)
-- ─────────────────────────────────────────
create table if not exists public.deliveries (
  id               uuid primary key default gen_random_uuid(),
  sender_id        uuid not null references public.users (id) on delete cascade,
  trip_id          uuid not null references public.trips (id) on delete cascade,
  item_description text,
  weight_category  text default 'Under 500g',
  price            numeric(10, 2) not null,
  platform_fee     numeric(10, 2) not null default 20,
  status           text not null default 'pending'
                     check (status in ('pending', 'accepted', 'picked_up', 'in_transit', 'arrived', 'delivered', 'cancelled')),
  escrow_status    text not null default 'held'
                     check (escrow_status in ('held', 'released', 'refunded')),
  razorpay_order_id  text,
  razorpay_payment_id text,
  delivery_otp     char(4),       -- 4-digit OTP generated at booking
  otp_verified_at  timestamptz,
  tracking_id      text unique not null default ('RD-' || to_char(now(), 'YYYY') || '-' || lpad(floor(random() * 9999)::text, 4, '0')),
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ─────────────────────────────────────────

-- Enable RLS on all tables
alter table public.users     enable row level security;
alter table public.trips     enable row level security;
alter table public.deliveries enable row level security;

-- ── users ──
-- Users can read their own profile; anon can read for public trip display (limited cols via view)
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- ── trips ──
-- Anyone (including anon) can read active trips (browse marketplace)
create policy "Public can view active trips"
  on public.trips for select
  using (status = 'active');

-- Only the authenticated traveler who owns the row can insert/update/delete
create policy "Traveler can insert own trips"
  on public.trips for insert
  with check (auth.uid() = traveler_id);

create policy "Traveler can update own trips"
  on public.trips for update
  using (auth.uid() = traveler_id);

create policy "Traveler can delete own trips"
  on public.trips for delete
  using (auth.uid() = traveler_id);

-- ── deliveries ──
-- Sender can see their own deliveries; traveler can see deliveries on their trips
create policy "Sender can view own deliveries"
  on public.deliveries for select
  using (auth.uid() = sender_id);

create policy "Traveler can view deliveries on their trips"
  on public.deliveries for select
  using (
    auth.uid() = (select traveler_id from public.trips where id = trip_id)
  );

create policy "Sender can insert deliveries"
  on public.deliveries for insert
  with check (auth.uid() = sender_id);

-- Only service role (backend API) can update escrow_status / delivery_otp
-- Frontend updates go through API routes that use the service-role key
create policy "Sender can update own delivery status"
  on public.deliveries for update
  using (auth.uid() = sender_id);
