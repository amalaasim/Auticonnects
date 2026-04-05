create table if not exists public.game_uploaded_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  game_key text not null,
  image_data text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, game_key)
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

drop trigger if exists game_uploaded_images_set_updated_at on public.game_uploaded_images;
create trigger game_uploaded_images_set_updated_at
before update on public.game_uploaded_images
for each row execute function public.set_updated_at();

alter table public.game_uploaded_images enable row level security;

drop policy if exists "Users manage own uploaded game images" on public.game_uploaded_images;
create policy "Users manage own uploaded game images"
on public.game_uploaded_images
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists game_uploaded_images_user_id_game_key_idx
  on public.game_uploaded_images (user_id, game_key);
