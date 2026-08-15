create table public.delivery_cache (
  id uuid primary key default gen_random_uuid(),
  origin_hash text not null,
  dest_hash text not null,
  distance_km numeric(10,2) not null,
  duration_min integer not null,
  fee numeric(10,2) not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days'),
  unique (origin_hash, dest_hash)
);
create index delivery_cache_expires_idx on public.delivery_cache (expires_at);
alter table public.delivery_cache enable row level security;
grant select on public.delivery_cache to anon, authenticated;
grant all on public.delivery_cache to service_role;
create policy "delivery_cache public read" on public.delivery_cache for select to anon, authenticated using (true);

create table public.geocode_cache (
  address_hash text primary key,
  lon numeric(10,6) not null,
  lat numeric(10,6) not null,
  place_name text not null default '',
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '30 days')
);
alter table public.geocode_cache enable row level security;
grant all on public.geocode_cache to service_role;

create table public.rate_limits (
  key text primary key,
  count integer not null default 1,
  window_start timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.rate_limits enable row level security;
grant all on public.rate_limits to service_role;

create or replace function public.bump_rate_limit(
  p_key text,
  p_window_minutes integer,
  p_max integer
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  cur_count integer;
begin
  update public.rate_limits
     set count = 1, window_start = now(), updated_at = now()
   where key = p_key
     and window_start < now() - make_interval(mins => p_window_minutes);

  insert into public.rate_limits (key, count, window_start)
  values (p_key, 1, now())
  on conflict (key) do nothing;

  select count into cur_count from public.rate_limits where key = p_key;

  if cur_count >= p_max then
    return false;
  end if;

  update public.rate_limits set count = count + 1, updated_at = now() where key = p_key;
  return true;
end;
$$;

revoke all on function public.bump_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.bump_rate_limit(text, integer, integer) to service_role;