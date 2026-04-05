create table if not exists public.game_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  game_key text not null,
  module_key text not null,
  source_app text not null,
  started_at timestamptz not null,
  ended_at timestamptz,
  duration_seconds integer,
  language text,
  status text not null default 'completed',
  voice_tries integer,
  select_tries integer,
  total_tries integer,
  star_count integer,
  completion_percent numeric,
  score_percent numeric,
  engagement_level text,
  gaze_reminders integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.session_emotion_metrics (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.game_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  emotion text not null,
  sample_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (session_id, emotion)
);

create table if not exists public.session_focus_metrics (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null unique references public.game_sessions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  focus_time_ms integer not null default 0,
  distracted_time_ms integer not null default 0,
  distraction_count integer not null default 0,
  focus_ratio numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists game_sessions_set_updated_at on public.game_sessions;
create trigger game_sessions_set_updated_at
before update on public.game_sessions
for each row execute function public.set_updated_at();

drop trigger if exists session_emotion_metrics_set_updated_at on public.session_emotion_metrics;
create trigger session_emotion_metrics_set_updated_at
before update on public.session_emotion_metrics
for each row execute function public.set_updated_at();

drop trigger if exists session_focus_metrics_set_updated_at on public.session_focus_metrics;
create trigger session_focus_metrics_set_updated_at
before update on public.session_focus_metrics
for each row execute function public.set_updated_at();

alter table public.game_sessions enable row level security;
alter table public.session_emotion_metrics enable row level security;
alter table public.session_focus_metrics enable row level security;

drop policy if exists "Users manage own game sessions" on public.game_sessions;
create policy "Users manage own game sessions"
on public.game_sessions
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own emotion metrics" on public.session_emotion_metrics;
create policy "Users manage own emotion metrics"
on public.session_emotion_metrics
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users manage own focus metrics" on public.session_focus_metrics;
create policy "Users manage own focus metrics"
on public.session_focus_metrics
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists game_sessions_user_id_started_at_idx
  on public.game_sessions (user_id, started_at desc);

create index if not exists game_sessions_user_id_module_key_idx
  on public.game_sessions (user_id, module_key);

create index if not exists session_emotion_metrics_user_id_idx
  on public.session_emotion_metrics (user_id, emotion);

create index if not exists session_focus_metrics_user_id_idx
  on public.session_focus_metrics (user_id);
