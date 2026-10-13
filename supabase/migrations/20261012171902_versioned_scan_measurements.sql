-- Owner-reviewed tracking identities and versioned, server-written scan evidence.
create table public.business_measurement_config (
  business_id uuid primary key references public.businesses(id) on delete cascade,
  target_aliases jsonb not null default '[]'::jsonb check (jsonb_typeof(target_aliases) = 'array'),
  competitors jsonb not null default '[]'::jsonb check (jsonb_typeof(competitors) = 'array'),
  reviewed_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scan_measurements (
  scan_id uuid primary key references public.scans(id) on delete cascade,
  status text not null default 'PENDING' check (status in ('PENDING', 'RUNNING', 'SUCCEEDED', 'PARTIALLY_FAILED', 'FAILED')),
  snapshot jsonb not null check (jsonb_typeof(snapshot) = 'object'),
  evidence jsonb not null default '[]'::jsonb check (jsonb_typeof(evidence) = 'array'),
  metrics jsonb not null default '{}'::jsonb check (jsonb_typeof(metrics) = 'object'),
  provider_payloads jsonb not null default '[]'::jsonb check (jsonb_typeof(provider_payloads) = 'array'),
  error_text text,
  attempt integer not null default 0 check (attempt >= 0),
  worker_lease_until timestamptz,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);
create index scan_measurements_queue on public.scan_measurements (created_at) where status = 'PENDING';

alter table public.business_measurement_config enable row level security;
alter table public.scan_measurements enable row level security;
revoke all on public.business_measurement_config, public.scan_measurements from anon, authenticated;
grant select, insert, update on public.business_measurement_config to authenticated;
grant select on public.scan_measurements to authenticated;
grant all on public.business_measurement_config, public.scan_measurements to service_role;

create policy "Owners read measurement config" on public.business_measurement_config for select to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())));
create policy "Owners create measurement config" on public.business_measurement_config for insert to authenticated
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())));
create policy "Owners edit measurement config" on public.business_measurement_config for update to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())))
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())));

create policy "Owners read scan measurements" on public.scan_measurements for select to authenticated
  using (exists (select 1 from public.scans s join public.businesses b on b.id = s.business_id
    where s.id = scan_id and b.user_id = (select auth.uid())));
