-- PresenceAI Phase 1. Model-owned data is never written to business_truth.
create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 4000),
  website text not null check (website ~* '^https?://[^[:space:]]+$' and char_length(website) <= 4000),
  category text not null check (char_length(category) between 1 and 4000),
  country text not null check (char_length(country) between 1 and 4000),
  city text not null check (char_length(city) between 1 and 4000),
  branch text not null default '' check (char_length(branch) <= 4000),
  created_at timestamptz not null default now()
);

create index businesses_owner_created on public.businesses (user_id, created_at desc);

create table public.business_truth (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  version integer not null check (version > 0),
  data jsonb not null check (jsonb_typeof(data) = 'object'),
  verified_by uuid not null references auth.users(id),
  verified_at timestamptz not null default now(),
  unique (business_id, version)
);

alter table public.businesses enable row level security;
alter table public.business_truth enable row level security;

revoke all on public.businesses from anon, authenticated;
revoke all on public.business_truth from anon, authenticated;
grant select, insert on public.businesses to authenticated;
grant select, insert on public.business_truth to authenticated;

create policy "Owners read businesses"
  on public.businesses for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Owners create businesses"
  on public.businesses for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Owners read verified truth"
  on public.business_truth for select to authenticated
  using (exists (
    select 1 from public.businesses
    where businesses.id = business_truth.business_id
      and businesses.user_id = (select auth.uid())
  ));

create policy "Owners append verified truth"
  on public.business_truth for insert to authenticated
  with check (
    verified_by = (select auth.uid())
    and exists (
      select 1 from public.businesses
      where businesses.id = business_truth.business_id
        and businesses.user_id = (select auth.uid())
    )
  );
