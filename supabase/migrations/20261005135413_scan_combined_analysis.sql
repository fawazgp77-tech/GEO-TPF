-- One server-written synthesis per scan, separate from immutable prompt answers.
create table public.scan_analyses (
  id uuid primary key default gen_random_uuid(),
  scan_id uuid not null unique references public.scans(id) on delete cascade,
  status text not null check (status in ('SUCCEEDED', 'FAILED')),
  report jsonb not null default '{}'::jsonb check (jsonb_typeof(report) = 'object'),
  provider_payload jsonb not null default '{}'::jsonb check (jsonb_typeof(provider_payload) = 'object'),
  error_text text,
  created_at timestamptz not null default now()
);

alter table public.scan_analyses enable row level security;
revoke all on public.scan_analyses from anon, authenticated;
grant select on public.scan_analyses to authenticated;
grant all on public.scan_analyses to service_role;

create policy "Owners read scan analyses" on public.scan_analyses for select to authenticated
  using (exists (select 1 from public.scans s join public.businesses b on b.id = s.business_id
    where s.id = scan_id and b.user_id = (select auth.uid())));
