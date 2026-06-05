
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;



create table if not exists public.post_comments (
  id uuid primary key default gen_random_uuid(),

  post_id uuid not null
    references public.posts(id)
    on delete cascade,

  author_id uuid not null
    references auth.users(id)
    on delete cascade,

  content text not null
    check (char_length(trim(content)) > 0),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.post_comments enable row level security;

drop trigger if exists set_post_comments_updated_at on public.post_comments;

create trigger set_post_comments_updated_at
before update on public.post_comments
for each row
execute function public.set_updated_at();



create table if not exists public.post_reactions (
  id uuid primary key default gen_random_uuid(),

  post_id uuid not null
    references public.posts(id)
    on delete cascade,

  author_id uuid not null
    references auth.users(id)
    on delete cascade,

  reaction_type text not null
    check (reaction_type in ('LIKE', 'DISLIKE')),

  created_at timestamptz not null default now(),

  constraint unique_user_reaction_per_post
    unique (post_id, author_id)
);

alter table public.post_reactions enable row level security;


create index if not exists post_comments_post_id_idx
on public.post_comments(post_id);

create index if not exists post_comments_author_id_idx
on public.post_comments(author_id);

create index if not exists post_reactions_post_id_idx
on public.post_reactions(post_id);

create index if not exists post_reactions_author_id_idx
on public.post_reactions(author_id);

create index if not exists post_reactions_post_author_idx
on public.post_reactions(post_id, author_id);



drop policy if exists "Anyone can view comments" on public.post_comments;
drop policy if exists "Users can insert own comments" on public.post_comments;
drop policy if exists "Users can update own comments" on public.post_comments;
drop policy if exists "Users can delete own comments" on public.post_comments;

create policy "Anyone can view comments"
on public.post_comments
for select
to authenticated
using (true);

create policy "Users can insert own comments"
on public.post_comments
for insert
to authenticated
with check (auth.uid() = author_id);

create policy "Users can update own comments"
on public.post_comments
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Users can delete own comments"
on public.post_comments
for delete
to authenticated
using (auth.uid() = author_id);



drop policy if exists "Anyone can view reactions" on public.post_reactions;
drop policy if exists "Users can insert own reactions" on public.post_reactions;
drop policy if exists "Users can update own reactions" on public.post_reactions;
drop policy if exists "Users can delete own reactions" on public.post_reactions;

create policy "Anyone can view reactions"
on public.post_reactions
for select
to authenticated
using (true);

create policy "Users can insert own reactions"
on public.post_reactions
for insert
to authenticated
with check (auth.uid() = author_id);

create policy "Users can update own reactions"
on public.post_reactions
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

create policy "Users can delete own reactions"
on public.post_reactions
for delete
to authenticated
using (auth.uid() = author_id);