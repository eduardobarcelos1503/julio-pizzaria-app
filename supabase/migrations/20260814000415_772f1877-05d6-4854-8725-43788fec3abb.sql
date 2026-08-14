-- ============ ROLES ============
create type public.app_role as enum ('admin');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select public.has_role(auth.uid(), 'admin')
$$;

create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

-- ============ MENU ============
create table public.menu_flavors (
  id uuid primary key default gen_random_uuid(),
  list text not null check (list in ('tradicional','promocional','doce')),
  name text not null,
  description text not null default '',
  sort integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.menu_sizes (
  id uuid primary key default gen_random_uuid(),
  category_id text not null check (category_id in ('tradicional','promocional','doce','premium')),
  category_label text not null,
  category_tagline text not null default '',
  size_id text not null check (size_id in ('broto','media','grande','unico')),
  label text not null,
  slices text not null default '',
  max_flavors integer not null default 1,
  price numeric(10,2) not null default 0,
  sort integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, size_id)
);

create table public.promo_prices (
  flavor_count integer primary key,
  price numeric(10,2) not null,
  updated_at timestamptz not null default now()
);

create table public.border_options (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  sort integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.border_prices (
  size_id text primary key check (size_id in ('broto','media','grande','unico')),
  price numeric(10,2) not null default 0,
  updated_at timestamptz not null default now()
);

create table public.drinks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(10,2) not null default 0,
  image_key text not null default 'coca',
  sort integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.combos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10,2),
  old_price numeric(10,2),
  image_key text not null default 'pizza-1',
  sort integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============ DELIVERY ============
-- VALORES DE EXEMPLO (placeholders) — confirmar com o dono da pizzaria.
create table public.delivery_settings (
  id boolean primary key default true check (id),
  mode text not null default 'tiers' check (mode in ('tiers','per_km')),
  base_fee numeric(10,2) not null default 5.00,
  per_km numeric(10,2) not null default 1.50,
  max_km numeric(10,2) not null default 12,
  updated_at timestamptz not null default now()
);

create table public.delivery_tiers (
  id uuid primary key default gen_random_uuid(),
  up_to_km numeric(10,2) not null,
  fee numeric(10,2) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.delivery_settings (id) values (true);
insert into public.delivery_tiers (up_to_km, fee) values (3, 6.00), (6, 9.00), (9, 12.00), (12, 16.00);
insert into public.promo_prices (flavor_count, price) values (1, 28.90), (2, 32.90);

-- ============ GRANTS + RLS ============
do $$
declare t text;
begin
  foreach t in array array['menu_flavors','menu_sizes','promo_prices','border_options','border_prices','drinks','combos','delivery_settings','delivery_tiers']
  loop
    execute format('grant select on public.%I to anon, authenticated', t);
    execute format('grant insert, update, delete on public.%I to authenticated', t);
    execute format('grant all on public.%I to service_role', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('create policy "public read" on public.%I for select to anon, authenticated using (true)', t);
    execute format('create policy "admin insert" on public.%I for insert to authenticated with check (public.is_admin())', t);
    execute format('create policy "admin update" on public.%I for update to authenticated using (public.is_admin()) with check (public.is_admin())', t);
    execute format('create policy "admin delete" on public.%I for delete to authenticated using (public.is_admin())', t);
    execute format('create trigger set_updated_at before update on public.%I for each row execute function public.update_updated_at_column()', t);
  end loop;
end $$;