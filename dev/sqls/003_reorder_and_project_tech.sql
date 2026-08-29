-- ================================================================
-- 003_reorder_and_project_tech.sql
-- Adds the pieces needed for drag-to-reorder dashboards and the
-- project tech-icon (tech_tools) picker.
--
--  1. certificates.sort_order    (drag-reorder, ASC = first)
--  2. projects.order_index backfill (one-time, keeps current order)
--  3. projects.tech_ids uuid[]   (referenced tech_tools ids)
--
-- RUN ORDER (existing DB): 002 then 003.
-- On a fresh DB: 001 then 002 (no-op) then 003.
-- ================================================================

-- 1. certificates.sort_order --------------------------------------
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS sort_order integer NOT NULL DEFAULT 0;

-- One-time backfill: number existing rows by the order currently
-- shown on the site (newest first) so the visuals do not flip.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.certificates)
     AND NOT EXISTS (SELECT 1 FROM public.certificates WHERE sort_order <> 0) THEN
    WITH ranked AS (
      SELECT id, row_number() OVER (ORDER BY created_at DESC, id DESC) AS rn
      FROM public.certificates
    )
    UPDATE public.certificates c
    SET sort_order = ranked.rn
    FROM ranked
    WHERE c.id = ranked.id;
  END IF;
END $$;

-- 2. projects.order_index backfill --------------------------------
-- Preserves the current displayed order when the column is still all
-- defaults, otherwise leaves existing (intentional) values alone.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.projects)
     AND NOT EXISTS (SELECT 1 FROM public.projects WHERE order_index <> 0) THEN
    WITH ranked AS (
      SELECT id, row_number() OVER (ORDER BY created_at DESC, id DESC) AS rn
      FROM public.projects
    )
    UPDATE public.projects p
    SET order_index = ranked.rn
    FROM ranked
    WHERE p.id = ranked.id;
  END IF;
END $$;

-- 3. projects.tech_ids (referenced tech_tools ids) ----------------
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS tech_ids uuid[] NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS projects_tech_ids_idx ON public.projects USING gin (tech_ids);

-- ================================================================
-- Verify:
--   SELECT id, img, sort_order FROM public.certificates ORDER BY sort_order;
--   SELECT id, title, order_index, tech_ids FROM public.projects ORDER BY order_index;
-- ================================================================