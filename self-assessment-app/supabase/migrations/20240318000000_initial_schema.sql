-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Create enum types
create type user_role as enum ('user', 'admin');
create type assessment_status as enum ('draft', 'in_progress', 'completed');

-- Create tables
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    role user_role default 'user',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.categories (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    "order" integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique ("order")
);

create table public.preambles (
    id uuid default uuid_generate_v4() primary key,
    category_id uuid references public.categories on delete cascade not null,
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.questions (
    id uuid default uuid_generate_v4() primary key,
    category_id uuid references public.categories on delete cascade not null,
    content text not null,
    "order" integer not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (category_id, "order")
);

create table public.assessments (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles on delete cascade not null,
    status assessment_status default 'draft' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.responses (
    id uuid default uuid_generate_v4() primary key,
    assessment_id uuid references public.assessments on delete cascade not null,
    question_id uuid references public.questions on delete cascade not null,
    answer text not null,
    confidence_level integer not null check (confidence_level between 1 and 5),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (assessment_id, question_id)
);

create table public.reports (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles on delete cascade not null,
    title text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.report_sections (
    id uuid default uuid_generate_v4() primary key,
    report_id uuid references public.reports on delete cascade not null,
    category_id uuid references public.categories on delete cascade not null,
    confidence_level integer not null check (confidence_level between 1 and 5),
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create indexes for better query performance
create index idx_categories_order on public.categories("order");
create index idx_questions_category_order on public.questions(category_id, "order");
create index idx_responses_assessment on public.responses(assessment_id);
create index idx_report_sections_report on public.report_sections(report_id);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.preambles enable row level security;
alter table public.questions enable row level security;
alter table public.assessments enable row level security;
alter table public.responses enable row level security;
alter table public.reports enable row level security;
alter table public.report_sections enable row level security;

-- Create RLS policies
-- Profiles: Users can read all profiles but only update their own
create policy "Profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

-- Categories: Viewable by all, modifiable by admins
create policy "Categories are viewable by everyone"
    on public.categories for select
    using (true);

create policy "Categories are modifiable by admins"
    on public.categories for all
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid()
            and role = 'admin'
        )
    );

-- Create functions for admin operations
create or replace function is_admin()
returns boolean as $$
begin
    return exists (
        select 1 from public.profiles
        where id = auth.uid()
        and role = 'admin'
    );
end;
$$ language plpgsql security definer;

-- Triggers for updated_at
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- Create triggers for all tables
create trigger update_profiles_updated_at
    before update on public.profiles
    for each row execute function update_updated_at_column();

create trigger update_categories_updated_at
    before update on public.categories
    for each row execute function update_updated_at_column();

create trigger update_preambles_updated_at
    before update on public.preambles
    for each row execute function update_updated_at_column();

create trigger update_questions_updated_at
    before update on public.questions
    for each row execute function update_updated_at_column();

create trigger update_assessments_updated_at
    before update on public.assessments
    for each row execute function update_updated_at_column();

create trigger update_responses_updated_at
    before update on public.responses
    for each row execute function update_updated_at_column();

create trigger update_reports_updated_at
    before update on public.reports
    for each row execute function update_updated_at_column();

create trigger update_report_sections_updated_at
    before update on public.report_sections
    for each row execute function update_updated_at_column(); 