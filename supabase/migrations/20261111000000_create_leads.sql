-- Leads captured from the landing-page contact form.
-- The public site may INSERT only. Nobody can read leads with the public key;
-- view them in the Supabase dashboard (Table Editor → leads) or with the service role.

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  name         text not null check (char_length(name) between 1 and 200),
  email        text not null check (char_length(email) between 3 and 320 and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  company      text not null check (char_length(company) between 1 and 200),
  goal         text not null check (char_length(goal) between 1 and 200),
  note         text check (note is null or char_length(note) <= 4000),
  source_url   text check (source_url is null or char_length(source_url) <= 2000),
  status       text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'won', 'lost'))
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Lock the table down, then grant only what the form needs.
revoke all on table public.leads from anon, authenticated;
grant insert (name, email, company, goal, note, source_url) on table public.leads to anon;

drop policy if exists "Public form can insert leads" on public.leads;
create policy "Public form can insert leads"
  on public.leads
  for insert
  to anon
  with check (status = 'new');
