# SQL Migrations

Clean, idempotent migrations for the Supabase project. Run them in the **SQL Editor**, in number order.

## Run order

| File | When | What it does |
| --- | --- | --- |
| `001_full_schema.sql` | **New/fresh DB only** | Full schema: buckets, tables (incl. `tech_tools` with fixed ids), RLS, storage policies, seeds (`profiles`, `app_settings`, `tech_tools`). |
| `002_fix_tech_tool_ids.sql` | **Existing DB** (no-op on fresh) | Rewrites the previously auto-generated `tech_tools` ids to the canonical fixed ids. |
| `003_reorder_and_project_tech.sql` | Existing + fresh DB | Adds `certificates.sort_order`, backfills `projects.order_index`, adds `projects.tech_ids uuid[]`. |

Checklist for an **existing** database: run `002` then `003` only.

## Key conventions

- **Drag order** — every reorderable list sorts by an integer column, ascending, first item = `1`:
  - `projects.order_index`, `certificates.sort_order`, `tech_tools.sort_order`
- **Theme-aware tech icons** — `tech_tools.image` is the dark/default icon; `image_light` is the optional light-mode icon (`NULL` = use `image` in both).
- **Project tech icons** — `projects.tech_ids` stores `tech_tools.id` UUIDs (comma-separated in the dashboard form). The canonical id→name map lives in [`../tech-tools.md`](../tech-tools.md).
- **Admin gate** — every admin policy checks `public.profiles.role = 'admin'`.

## Verify after running

```sql
SELECT name, sort_order FROM public.tech_tools ORDER BY sort_order;
SELECT id, title, order_index, tech_ids FROM public.projects ORDER BY order_index;
SELECT id, sort_order FROM public.certificates ORDER BY sort_order;
```