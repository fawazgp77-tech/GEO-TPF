create unique index scans_one_active_per_business on public.scans (business_id)
  where status in ('PENDING', 'RUNNING');
