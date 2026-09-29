-- Phase 2: stable customer prompts and immutable scan evidence.
create table public.prompts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  category text not null check (category in ('DISCOVERY', 'RECOMMENDATION', 'COMMERCIAL', 'LOCAL', 'COMPARISON', 'SERVICE')),
  text text not null check (char_length(trim(text)) between 5 and 500),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index prompts_business_created on public.prompts (business_id, created_at);

create table public.scans (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references public.businesses(id) on delete cascade,
  truth_version integer not null check (truth_version > 0),
  status text not null default 'PENDING' check (status in ('PENDING', 'RUNNING', 'COMPLETED', 'PARTIALLY_FAILED', 'FAILED')),
  provider text not null,
  model text not null,
  attempt integer not null default 0 check (attempt >= 0),
  worker_lease_until timestamptz,
  created_at timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz
);
create index scans_business_created on public.scans (business_id, created_at desc);
create index scans_queue on public.scans (created_at) where status = 'PENDING';

create table public.prompt_runs (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  prompt_id uuid references public.prompts(id) on delete set null,
  exact_prompt text not null,
  category text not null,
  status text not null default 'PENDING' check (status in ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED')),
  attempt integer not null default 0 check (attempt >= 0),
  error_text text,
  started_at timestamptz,
  completed_at timestamptz
);
create index prompt_runs_scan on public.prompt_runs (scan_id);
create index prompt_runs_prompt on public.prompt_runs (prompt_id);

create table public.raw_responses (
  id uuid primary key default gen_random_uuid(),
  prompt_run_id uuid not null unique references public.prompt_runs(id) on delete cascade,
  provider text not null,
  model text not null,
  response_text text not null,
  citations jsonb not null default '[]'::jsonb check (jsonb_typeof(citations) = 'array'),
  metadata jsonb not null default '{}'::jsonb check (jsonb_typeof(metadata) = 'object'),
  provider_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_payload) = 'object'),
  received_at timestamptz not null default now()
);

alter table public.prompts enable row level security;
alter table public.scans enable row level security;
alter table public.prompt_runs enable row level security;
alter table public.raw_responses enable row level security;

revoke all on public.prompts, public.scans, public.prompt_runs, public.raw_responses from anon, authenticated;
grant select, insert, update, delete on public.prompts to authenticated;
grant select on public.scans, public.prompt_runs, public.raw_responses to authenticated;
grant all on public.prompts, public.scans, public.prompt_runs, public.raw_responses to service_role;

create policy "Owners read prompts" on public.prompts for select to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())));
create policy "Owners create prompts" on public.prompts for insert to authenticated
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())));
create policy "Owners edit prompts" on public.prompts for update to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())))
  with check (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())));
create policy "Owners delete prompts" on public.prompts for delete to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())));

create policy "Owners read scans" on public.scans for select to authenticated
  using (exists (select 1 from public.businesses b where b.id = business_id and b.user_id = (select auth.uid())));
create policy "Owners read prompt runs" on public.prompt_runs for select to authenticated
  using (exists (select 1 from public.scans s join public.businesses b on b.id = s.business_id
    where s.id = scan_id and b.user_id = (select auth.uid())));
create policy "Owners read raw responses" on public.raw_responses for select to authenticated
  using (exists (select 1 from public.prompt_runs r join public.scans s on s.id = r.scan_id
    join public.businesses b on b.id = s.business_id
    where r.id = prompt_run_id and b.user_id = (select auth.uid())));
