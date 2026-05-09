create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.user_profiles (
  id uuid primary key default gen_random_uuid(),
  open_id text not null unique,
  email text,
  display_name text not null default 'GetBooked member',
  role text,
  onboarding_complete boolean not null default false,
  profile_completion integer not null default 32,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint user_profiles_role_check check (role is null or role in ('artist','promoter','venue','crew','creative')),
  constraint user_profiles_profile_completion_check check (profile_completion between 0 and 100)
);

create table if not exists public.waitlist_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  role_interest text not null,
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.artist_profiles (
  id uuid primary key default gen_random_uuid(),
  open_id text unique,
  email text,
  name text not null,
  slug text not null unique,
  city text not null,
  country text not null default 'USA',
  bio text,
  genre text,
  fee_min integer,
  fee_max integer,
  price_label text,
  bookscore integer not null default 0,
  hero_image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint artist_profiles_bookscore_check check (bookscore between 0 and 100)
);

create table if not exists public.venue_profiles (
  id uuid primary key default gen_random_uuid(),
  open_id text unique,
  email text,
  name text not null,
  slug text not null unique,
  city text not null,
  country text not null default 'USA',
  bio text,
  venue_type text,
  capacity integer,
  rate_min integer,
  rate_max integer,
  rate_label text,
  hero_image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.crew_profiles (
  id uuid primary key default gen_random_uuid(),
  open_id text unique,
  email text,
  name text not null,
  slug text not null unique,
  city text not null,
  country text not null default 'USA',
  bio text,
  primary_skill text,
  rate_min integer,
  rate_max integer,
  rate_label text,
  hero_image_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.creative_profiles (
  id uuid primary key default gen_random_uuid(),
  open_id text unique,
  email text,
  name text not null,
  slug text not null unique,
  city text not null,
  country text not null default 'USA',
  bio text,
  creative_type text,
  rate_min integer,
  rate_max integer,
  rate_label text,
  portfolio_cover_url text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.bookscore_snapshots (
  id uuid primary key default gen_random_uuid(),
  artist_slug text not null references public.artist_profiles(slug) on delete cascade,
  booking_completion_score integer not null,
  response_rate_score integer not null,
  review_score integer not null,
  bookscore_total integer not null,
  calculated_at timestamptz not null default timezone('utc', now()),
  constraint bookscore_snapshots_booking_completion_check check (booking_completion_score between 0 and 100),
  constraint bookscore_snapshots_response_rate_check check (response_rate_score between 0 and 100),
  constraint bookscore_snapshots_review_check check (review_score between 0 and 100),
  constraint bookscore_snapshots_total_check check (bookscore_total between 0 and 100)
);

create index if not exists idx_user_profiles_role on public.user_profiles(role);
create index if not exists idx_artist_profiles_city on public.artist_profiles(city);
create index if not exists idx_artist_profiles_genre on public.artist_profiles(genre);
create index if not exists idx_artist_profiles_bookscore on public.artist_profiles(bookscore desc);
create index if not exists idx_venue_profiles_city on public.venue_profiles(city);
create index if not exists idx_venue_profiles_type on public.venue_profiles(venue_type);
create index if not exists idx_crew_profiles_city on public.crew_profiles(city);
create index if not exists idx_crew_profiles_skill on public.crew_profiles(primary_skill);
create index if not exists idx_creative_profiles_city on public.creative_profiles(city);
create index if not exists idx_creative_profiles_type on public.creative_profiles(creative_type);
create index if not exists idx_bookscore_snapshots_artist_slug on public.bookscore_snapshots(artist_slug, calculated_at desc);

create or replace trigger user_profiles_set_updated_at
before update on public.user_profiles
for each row execute function public.set_updated_at();

create or replace trigger artist_profiles_set_updated_at
before update on public.artist_profiles
for each row execute function public.set_updated_at();

create or replace trigger venue_profiles_set_updated_at
before update on public.venue_profiles
for each row execute function public.set_updated_at();

create or replace trigger crew_profiles_set_updated_at
before update on public.crew_profiles
for each row execute function public.set_updated_at();

create or replace trigger creative_profiles_set_updated_at
before update on public.creative_profiles
for each row execute function public.set_updated_at();

insert into public.artist_profiles (slug, name, city, country, bio, genre, fee_min, fee_max, price_label, bookscore, hero_image_url)
values
  ('midnight-sonar', 'Midnight Sonar', 'Los Angeles', 'USA', 'Indie electronic trio with cinematic live visuals.', 'indie electronic', 4500, 6000, '$4.5k–$6k', 92, 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=80'),
  ('neon-harbor', 'Neon Harbor', 'New York', 'USA', 'Alt-pop headliner known for sold-out coastal tours.', 'alt pop', 8000, 12000, '$8k–$12k', 88, 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80')
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  country = excluded.country,
  bio = excluded.bio,
  genre = excluded.genre,
  fee_min = excluded.fee_min,
  fee_max = excluded.fee_max,
  price_label = excluded.price_label,
  bookscore = excluded.bookscore,
  hero_image_url = excluded.hero_image_url,
  updated_at = timezone('utc', now());

insert into public.venue_profiles (slug, name, city, country, bio, venue_type, capacity, rate_min, rate_max, rate_label, hero_image_url)
values
  ('the-echo-room', 'The Echo Room', 'Chicago', 'USA', 'Modern 600-cap room with premium FOH package.', 'club', 600, 1800, 2600, '$1.8k–$2.6k', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80'),
  ('lantern-hall', 'Lantern Hall', 'Nashville', 'USA', 'Historic theater built for seated showcases and livestreams.', 'theater', 950, 3200, 4400, '$3.2k–$4.4k', 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=900&q=80')
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  country = excluded.country,
  bio = excluded.bio,
  venue_type = excluded.venue_type,
  capacity = excluded.capacity,
  rate_min = excluded.rate_min,
  rate_max = excluded.rate_max,
  rate_label = excluded.rate_label,
  hero_image_url = excluded.hero_image_url,
  updated_at = timezone('utc', now());

insert into public.crew_profiles (slug, name, city, country, bio, primary_skill, rate_min, rate_max, rate_label, hero_image_url)
values
  ('signal-chain-touring', 'Signal Chain Touring', 'Austin', 'USA', 'Touring audio team covering FOH, monitors, and playback.', 'sound', 650, 650, '$650/day', 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80'),
  ('lightgrid-ops', 'LightGrid Ops', 'Atlanta', 'USA', 'Lighting programmers and operators for high-impact rooms.', 'lights', 720, 720, '$720/day', 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=900&q=80')
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  country = excluded.country,
  bio = excluded.bio,
  primary_skill = excluded.primary_skill,
  rate_min = excluded.rate_min,
  rate_max = excluded.rate_max,
  rate_label = excluded.rate_label,
  hero_image_url = excluded.hero_image_url,
  updated_at = timezone('utc', now());

insert into public.creative_profiles (slug, name, city, country, bio, creative_type, rate_min, rate_max, rate_label, portfolio_cover_url)
values
  ('frame-society', 'Frame Society', 'Brooklyn', 'USA', 'Concert photo and backstage editorial team.', 'photographer', 1200, 1200, '$1.2k/project', 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=900&q=80'),
  ('reel-motion-studio', 'Reel Motion Studio', 'Miami', 'USA', 'Tour recap films and high-speed social edits.', 'videographer', 2400, 2400, '$2.4k/project', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80')
on conflict (slug) do update set
  name = excluded.name,
  city = excluded.city,
  country = excluded.country,
  bio = excluded.bio,
  creative_type = excluded.creative_type,
  rate_min = excluded.rate_min,
  rate_max = excluded.rate_max,
  rate_label = excluded.rate_label,
  portfolio_cover_url = excluded.portfolio_cover_url,
  updated_at = timezone('utc', now());
