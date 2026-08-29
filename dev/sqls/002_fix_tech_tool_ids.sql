-- ================================================================
-- 002_fix_tech_tool_ids.sql
-- Bring an EXISTING database in line with the FIXED tech_tools ids
-- defined in 001_full_schema.sql.
--
-- The tech_tools table was originally seeded with auto-generated
-- ids, which cannot be referenced deterministically by the projects
-- form. This migration rewrites those rows to the canonical ids.
-- It is a no-op on a fresh database where 001 already seeded them.
-- ================================================================

UPDATE public.tech_tools SET id = '2a001d7a-89f3-4527-8406-62704d4462f5' WHERE name = 'HTML';
UPDATE public.tech_tools SET id = 'e4472579-e200-418d-9a6e-ff8cc8abe9a9' WHERE name = 'CSS';
UPDATE public.tech_tools SET id = 'a2c4d553-876d-4b1f-8590-9bb695fc17d9' WHERE name = 'JavaScript';
UPDATE public.tech_tools SET id = 'e2686ee2-8afd-4064-b192-eb800086236c' WHERE name = 'TypeScript';
UPDATE public.tech_tools SET id = '3cd3e472-b847-4f4b-9fb4-44b911cdb45d' WHERE name = 'React';
UPDATE public.tech_tools SET id = '2f8bd682-2d47-46c8-8011-8bd9c41ee12e' WHERE name = 'Tailwind';
UPDATE public.tech_tools SET id = '4b5012f9-1680-48b1-ab97-76dbd4c51ef3' WHERE name = 'Next.js';
UPDATE public.tech_tools SET id = '7c4cf130-9393-4ab2-8eea-3121da20a0bd' WHERE name = 'PostgreSQL';
UPDATE public.tech_tools SET id = '854306cf-d6e7-49e2-aaca-0aa0a4e7335c' WHERE name = 'Vite';
UPDATE public.tech_tools SET id = 'c5b4c5f9-f939-403c-a67f-2a74c7135e1d' WHERE name = 'Vue';
UPDATE public.tech_tools SET id = '46a5b1f0-3745-4d4f-8f2a-a61c5d58de8d' WHERE name = 'Node.js';
UPDATE public.tech_tools SET id = 'f0d8b6af-1836-41ef-ad42-25f6bde1a43b' WHERE name = 'Express.js';
UPDATE public.tech_tools SET id = '11d5820b-43d5-43bd-9a5b-2cf460607e60' WHERE name = 'JWT';
UPDATE public.tech_tools SET id = 'b75d25c5-010a-4d61-aa17-94dba39c0895' WHERE name = 'Supabase';
UPDATE public.tech_tools SET id = '2e9e63a9-47ba-4a8d-bf85-1198f49e6dd6' WHERE name = 'Firebase';
UPDATE public.tech_tools SET id = '46558a30-cfd0-4e82-8f10-d6f10fce2b1c' WHERE name = 'Git';
UPDATE public.tech_tools SET id = '0aa2a316-0f2e-4f6d-a2fb-7d331eecf95e' WHERE name = 'Vercel';
UPDATE public.tech_tools SET id = '57fbc4b6-f319-485d-af0e-f39286a78b5b' WHERE name = 'SweetAlert';
UPDATE public.tech_tools SET id = '6692045d-7246-4dbb-b5b6-8a16cfad3da3' WHERE name = 'Sonner';
UPDATE public.tech_tools SET id = '3038af61-7296-4159-a94d-67700c38e94a' WHERE name = 'Framer Motion';
UPDATE public.tech_tools SET id = '1be0236a-920e-4fe5-9d61-950fc4a86f42' WHERE name = 'Anime.js';
UPDATE public.tech_tools SET id = '59803917-bcc8-4fa2-a0bb-24615a5a0372' WHERE name = 'i18next';
UPDATE public.tech_tools SET id = '059af572-6e42-4028-80b3-4a79cac8096e' WHERE name = 'Material UI';
UPDATE public.tech_tools SET id = 'f4ba4014-f351-45a9-ab15-7e4e8d81e0f0' WHERE name = 'C/C++';
UPDATE public.tech_tools SET id = '6232e7d7-a187-434e-9593-db164550ddf3' WHERE name = 'MySQL';
UPDATE public.tech_tools SET id = '60133789-9411-47fe-a916-815a2e8a2f88' WHERE name = 'PHP';
UPDATE public.tech_tools SET id = '21a7bed0-6146-495b-901c-3bb9842c0b67' WHERE name = 'Rust';
UPDATE public.tech_tools SET id = 'bc324786-cc0a-430c-84a5-2196260d1f81' WHERE name = 'Railway';
UPDATE public.tech_tools SET id = '06f451b8-7ac6-4498-b259-ecfdfebbcae3' WHERE name = 'Tauri';
UPDATE public.tech_tools SET id = '8ded38a8-4107-445b-933b-d8e500c6e6c2' WHERE name = 'Kotlin';
UPDATE public.tech_tools SET id = 'd148c636-8c23-4d18-9a19-6a8b74749bb5' WHERE name = 'Python';
UPDATE public.tech_tools SET id = 'b3ec92a4-8c3e-4e45-884b-ddaa4eded52b' WHERE name = 'Keras';
UPDATE public.tech_tools SET id = '7605d096-fa4d-4be9-a3f2-ae512c848e7c' WHERE name = 'TensorFlow';
UPDATE public.tech_tools SET id = 'fb51b4d7-5016-46c3-b53b-079b48da2307' WHERE name = 'Electron';

-- ================================================================
-- Verify:
--   SELECT count(*) FROM public.tech_tools t
--   LEFT JOIN (SELECT unnest(ARRAY['2a001d7a-89f3-4527-8406-62704d4462f5', ...]) AS id) u USING (id)
--   WHERE u.id IS NULL;  -- expects 0
-- ================================================================