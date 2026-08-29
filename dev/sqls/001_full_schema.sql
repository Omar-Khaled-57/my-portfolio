-- ================================================================
-- 001_full_schema.sql
-- Canonical full schema for the portfolio (fresh / new project).
--
-- Run ORDER (from a blank Supabase project, in the SQL Editor):
--   1. 001_full_schema.sql
--   2. 002_fix_tech_tool_ids.sql   (safety net; already fixed ids here)
--   3. 003_reorder_and_project_tech.sql
--
-- On an EXISTING database run only 002 and 003.
-- ================================================================

-- 0. Required extension -------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Storage buckets ----------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('project-images', 'project-images', true, 5242880,
        ARRAY['image/png','image/jpeg','image/webp','image/svg+xml','image/gif'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('certificate-images', 'certificate-images', true, 5242880,
        ARRAY['image/png','image/jpeg','image/webp','image/svg+xml','image/gif'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('profile-images', 'profile-images', true, 5242880,
        ARRAY['image/png','image/jpeg','image/webp','image/svg+xml','image/gif'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('tool-images', 'tool-images', true, 5242880,
        ARRAY['image/png','image/jpeg','image/webp','image/svg+xml','image/gif'])
ON CONFLICT (id) DO NOTHING;

-- 2. Tables -------------------------------------------------------

-- profiles (admin/user gate used by every admin policy)
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username text NOT NULL UNIQUE,
    role text NOT NULL CHECK (role IN ('admin', 'user')),
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_authenticated" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "profiles_insert_authenticated" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- IMPORTANT: replace the UUID below with your own admin user's id
-- (Supabase > Authentication > Users) after creating that user.
INSERT INTO public.profiles (id, username, role, created_at) VALUES
  ('b21af720-438e-4814-8731-4164f10e0b6d', 'Omar', 'admin', now())
ON CONFLICT (id) DO NOTHING;

-- app_settings (key/value site settings)
CREATE TABLE IF NOT EXISTS public.app_settings (
    key text NOT NULL PRIMARY KEY,
    value text NOT NULL
);

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "settings_select_public" ON public.app_settings FOR SELECT USING (true);
CREATE POLICY "settings_update_admin" ON public.app_settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

INSERT INTO public.app_settings (key, value) VALUES
  ('personalInfo_totalProjects', '"29"'),
  ('personalInfo_yearsExperience', '"2"'),
  ('personalInfo_showYearsExperience', 'false'),
  ('emails_frozen', 'false'),
  ('personalInfo_address', '6th of October, Giza'),
  ('comments_frozen', 'false'),
  ('personalInfo_addressAr', 'السادس من أكتوبر، الجيزة'),
  ('personalInfo_phone', '+20 112 302 9406'),
  ('personalInfo_email', 'khaledelkhly57@gmail.com'),
  ('personalInfo_socialLinks', '[{"platform":"GitHub","url":"https://github.com/Omar-Khaled-57"},{"platform":"LinkedIn","url":"https://linkedin.com/in/omar-khaled-el-khouly-0a0690313/"},{"platform":"WhatsApp","url":"https://wa.me/201123029406"}]'),
  ('personalInfo_profileImage', '""'),
  ('personalInfo_fullName', '""'),
  ('personalInfo_quote', '""')
ON CONFLICT (key) DO NOTHING;

-- portfolio_comments
CREATE TABLE IF NOT EXISTS public.portfolio_comments (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    content text NOT NULL,
    user_name text NOT NULL,
    profile_image text,
    is_pinned boolean DEFAULT false,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.portfolio_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "comments_select_public" ON public.portfolio_comments FOR SELECT USING (true);
CREATE POLICY "comments_insert_public" ON public.portfolio_comments FOR INSERT WITH CHECK (is_pinned = false);
CREATE POLICY "comments_update_admin" ON public.portfolio_comments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "comments_delete_admin" ON public.portfolio_comments FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- certificates (drag-reorder support via sort_order, ASC = first)
CREATE TABLE IF NOT EXISTS public.certificates (
    id integer GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    img text NOT NULL,
    created_at timestamptz DEFAULT now(),
    sort_order integer NOT NULL DEFAULT 0
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "certificates_select_public" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "certificates_insert_admin" ON public.certificates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "certificates_update_admin" ON public.certificates FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "certificates_delete_admin" ON public.certificates FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- projects (drag-reorder via order_index; tech_ids = referenced tech_tools.id)
CREATE TABLE IF NOT EXISTS public.projects (
    id integer GENERATED BY DEFAULT AS IDENTITY NOT NULL PRIMARY KEY,
    title text NOT NULL,
    title_ar text,
    description text NOT NULL,
    description_ar text,
    img text,
    link text,
    github text,
    features jsonb NOT NULL DEFAULT '[]'::jsonb,
    tech_stack jsonb NOT NULL DEFAULT '[]'::jsonb,
    tech_ids uuid[] NOT NULL DEFAULT '{}',
    is_published boolean NOT NULL DEFAULT true,
    order_index integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS projects_tech_ids_idx ON public.projects USING gin (tech_ids);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_select_public" ON public.projects FOR SELECT USING (true);
CREATE POLICY "projects_insert_admin" ON public.projects FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "projects_update_admin" ON public.projects FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "projects_delete_admin" ON public.projects FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- tech_tools (FIXED ids so the dashboard can reference them by id)
CREATE TABLE IF NOT EXISTS public.tech_tools (
    id uuid NOT NULL PRIMARY KEY,
    name text NOT NULL UNIQUE,
    image text NOT NULL,
    image_light text,
    type text NOT NULL DEFAULT 'Other' CHECK (type IN ('Main', 'Other')),
    tags text[] NOT NULL DEFAULT '{}',
    sort_order integer NOT NULL DEFAULT 0,
    created_at timestamptz DEFAULT now()
);

ALTER TABLE public.tech_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "tech_tools_select_public" ON public.tech_tools FOR SELECT USING (true);
CREATE POLICY "tech_tools_insert_admin" ON public.tech_tools FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "tech_tools_update_admin" ON public.tech_tools FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "tech_tools_delete_admin" ON public.tech_tools FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Auth trigger: auto-create a profile on user signup (optional).
-- Only relevant if Email Auth signups are enabled.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, role)
  VALUES (new.id, COALESCE(new.raw_user_meta_data ->> 'username', 'user'), 'user');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Storage RLS policies -----------------------------------------

CREATE POLICY "storage_select_project-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');
CREATE POLICY "storage_insert_project-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "storage_delete_project-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "storage_select_certificate-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'certificate-images');
CREATE POLICY "storage_insert_certificate-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'certificate-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "storage_delete_certificate-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'certificate-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "storage_select_profile-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "storage_insert_profile-images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'profile-images' AND auth.role() = 'authenticated');
CREATE POLICY "storage_delete_profile-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'profile-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "storage_select_tool-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'tool-images');
CREATE POLICY "storage_insert_tool-images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'tool-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "storage_delete_tool-images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'tool-images' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 4. Seed tech_tools (FIXED ids) ----------------------------------
-- image_light = NULL  => the single image is used in both themes.
-- Framer Motion uses a white variant for dark mode (image) and the
-- original black logo for light mode (image_light).
-- Keep this list in sync with dev/tech-tools.md.
INSERT INTO public.tech_tools (id, name, image, image_light, type, tags, sort_order) VALUES
  ('2a001d7a-89f3-4527-8406-62704d4462f5', 'HTML',          '/tools/html.svg',            NULL, 'Main', ARRAY['web'], 1),
  ('e4472579-e200-418d-9a6e-ff8cc8abe9a9', 'CSS',           '/tools/css.svg',             NULL, 'Main', ARRAY['web'], 2),
  ('a2c4d553-876d-4b1f-8590-9bb695fc17d9', 'JavaScript',    '/tools/js.svg',              NULL, 'Main', ARRAY['language','web'], 3),
  ('e2686ee2-8afd-4064-b192-eb800086236c', 'TypeScript',    '/tools/ts.svg',              NULL, 'Main', ARRAY['language','web'], 4),
  ('3cd3e472-b847-4f4b-9fb4-44b911cdb45d', 'React',         '/tools/react.svg',           NULL, 'Main', ARRAY['web','frontend'], 5),
  ('2f8bd682-2d47-46c8-8011-8bd9c41ee12e', 'Tailwind',      '/tools/tailwind.svg',        NULL, 'Main', ARRAY['web','frontend'], 6),
  ('4b5012f9-1680-48b1-ab97-76dbd4c51ef3', 'Next.js',       '/tools/next.svg',            NULL, 'Main', ARRAY['web','frontend'], 7),
  ('7c4cf130-9393-4ab2-8eea-3121da20a0bd', 'PostgreSQL',    '/tools/postgres.svg',        NULL, 'Main', ARRAY['database'], 8),
  ('854306cf-d6e7-49e2-aaca-0aa0a4e7335c', 'Vite',          '/tools/vite.svg',            NULL, 'Main', ARRAY['web','build'], 9),
  ('c5b4c5f9-f939-403c-a67f-2a74c7135e1d', 'Vue',           '/tools/vue.svg',             NULL, 'Main', ARRAY['web','frontend'], 10),
  ('46a5b1f0-3745-4d4f-8f2a-a61c5d58de8d', 'Node.js',       '/tools/nodejs.svg',          NULL, 'Main', ARRAY['backend','cross platform'], 11),
  ('f0d8b6af-1836-41ef-ad42-25f6bde1a43b', 'Express.js',    '/tools/express2.svg',        NULL, 'Main', ARRAY['backend'], 12),
  ('11d5820b-43d5-43bd-9a5b-2cf460607e60', 'JWT',           '/tools/jwt.svg',             NULL, 'Main', ARRAY['security'], 13),
  ('b75d25c5-010a-4d61-aa17-94dba39c0895', 'Supabase',      '/tools/supabase.svg',        NULL, 'Main', ARRAY['backend','database'], 14),
  ('2e9e63a9-47ba-4a8d-bf85-1198f49e6dd6', 'Firebase',      '/tools/firebase.svg',        NULL, 'Main', ARRAY['backend','database'], 15),
  ('46558a30-cfd0-4e82-8f10-d6f10fce2b1c', 'Git',           '/tools/git.svg',             NULL, 'Main', ARRAY['dev tools'], 16),
  ('0aa2a316-0f2e-4f6d-a2fb-7d331eecf95e', 'Vercel',        '/tools/vercel.svg',          NULL, 'Main', ARRAY['deployment'], 17),
  ('57fbc4b6-f319-485d-af0e-f39286a78b5b', 'SweetAlert',    '/tools/SweetAlert.svg',      NULL, 'Main', ARRAY['frontend'], 18),
  ('6692045d-7246-4dbb-b5b6-8a16cfad3da3', 'Sonner',        '/tools/sonner.svg',          NULL, 'Main', ARRAY['frontend'], 19),
  ('3038af61-7296-4159-a94d-67700c38e94a', 'Framer Motion', '/tools/framer-white.svg',    '/tools/framer.svg', 'Main', ARRAY['frontend','animation'], 20),
  ('1be0236a-920e-4fe5-9d61-950fc4a86f42', 'Anime.js',      '/tools/animejs.png',         NULL, 'Main', ARRAY['frontend','animation'], 21),
  ('59803917-bcc8-4fa2-a0bb-24615a5a0372', 'i18next',       '/tools/i18n.png',            NULL, 'Main', ARRAY['i18n'], 22),
  ('059af572-6e42-4028-80b3-4a79cac8096e', 'Material UI',   '/tools/MUI.svg',             NULL, 'Main', ARRAY['frontend'], 23),
  ('f4ba4014-f351-45a9-ab15-7e4e8d81e0f0', 'C/C++',         '/tools/cpp.svg',             NULL, 'Other', ARRAY['language','desktop','cross platform'], 24),
  ('6232e7d7-a187-434e-9593-db164550ddf3', 'MySQL',         '/tools/mysql.svg',           NULL, 'Other', ARRAY['database'], 25),
  ('60133789-9411-47fe-a916-815a2e8a2f88', 'PHP',           '/tools/php.svg',             NULL, 'Other', ARRAY['backend','language'], 26),
  ('21a7bed0-6146-495b-901c-3bb9842c0b67', 'Rust',          '/tools/rust-dark.svg',       '/tools/rust-light.svg', 'Other', ARRAY['language','desktop'], 27),
  ('bc324786-cc0a-430c-84a5-2196260d1f81', 'Railway',       '/tools/railway-dark.svg',    '/tools/railway-light.svg', 'Other', ARRAY['deployment'], 28),
  ('06f451b8-7ac6-4498-b259-ecfdfebbcae3', 'Tauri',         '/tools/tauri.svg',           NULL, 'Other', ARRAY['desktop','cross platform'], 29),
  ('8ded38a8-4107-445b-933b-d8e500c6e6c2', 'Kotlin',        '/tools/kotlin.svg',          NULL, 'Other', ARRAY['language','mobile'], 30),
  ('d148c636-8c23-4d18-9a19-6a8b74749bb5', 'Python',        '/tools/python.svg',          NULL, 'Other', ARRAY['language','backend','desktop'], 31),
  ('b3ec92a4-8c3e-4e45-884b-ddaa4eded52b', 'Keras',         '/tools/keras.svg',           NULL, 'Other', ARRAY['ai','machine learning'], 32),
  ('7605d096-fa4d-4be9-a3f2-ae512c848e7c', 'TensorFlow',    '/tools/tensorflow.svg',      NULL, 'Other', ARRAY['ai','machine learning'], 33),
  ('fb51b4d7-5016-46c3-b53b-079b48da2307', 'Electron',      '/tools/electron.svg',        NULL, 'Other', ARRAY['desktop','cross platform'], 34)
ON CONFLICT (name) DO UPDATE
SET id = EXCLUDED.id,
    image = EXCLUDED.image,
    image_light = EXCLUDED.image_light,
    type = EXCLUDED.type,
    tags = EXCLUDED.tags,
    sort_order = EXCLUDED.sort_order;

-- ================================================================
-- Done. Sanity checks:
--   SELECT name, sort_order FROM public.tech_tools ORDER BY sort_order;
--   SELECT id, title FROM public.projects ORDER BY order_index;
-- ================================================================