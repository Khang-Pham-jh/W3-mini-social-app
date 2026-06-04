create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users(id) on delete cascade,
  content text,
  image_urls text[] not null default '{}',
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint posts_require_content_or_image
    check (
      nullif(trim(coalesce(content, '')), '') is not null
      or array_length(image_urls, 1) > 0
    )
);

alter table public.posts enable row level security;

drop policy if exists "Authenticated users can view posts" on public.posts;
create policy "Authenticated users can view posts"
on public.posts
for select
to authenticated
using (true);

drop policy if exists "Users can create their own posts" on public.posts;
create policy "Users can create their own posts"
on public.posts
for insert
to authenticated
with check (auth.uid() = author_id);

drop policy if exists "Users can update their own posts" on public.posts;
create policy "Users can update their own posts"
on public.posts
for update
to authenticated
using (auth.uid() = author_id)
with check (auth.uid() = author_id);

drop policy if exists "Users can delete their own posts" on public.posts;
create policy "Users can delete their own posts"
on public.posts
for delete
to authenticated
using (auth.uid() = author_id);


create index if not exists posts_created_at_idx
on public.posts (created_at desc);

create table if not exists public.hidden_posts (
  user_id uuid not null references auth.users(id) on delete cascade,
  post_id uuid not null references public.posts(id) on delete cascade,
  hidden_at timestamp with time zone not null default now(),
  primary key (user_id, post_id)
);

alter table public.hidden_posts enable row level security;

drop policy if exists "Users can view their hidden posts" on public.hidden_posts;
create policy "Users can view their hidden posts"
on public.hidden_posts
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can hide posts for themselves" on public.hidden_posts;
create policy "Users can hide posts for themselves"
on public.hidden_posts
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can unhide posts for themselves" on public.hidden_posts;
create policy "Users can unhide posts for themselves"
on public.hidden_posts
for delete
to authenticated
using (auth.uid() = user_id);