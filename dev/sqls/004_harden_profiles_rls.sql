-- ================================================================
-- 004_harden_profiles_rls.sql
-- C1 (CRITICAL): any authenticated user could INSERT their own
-- profiles row with role='admin' (insert policy only checked
-- auth.uid() = id) or UPDATE their own row to role='admin'
-- (update policy had no WITH CHECK). Since every dashboard gate
-- trusts profiles.role = 'admin', that was full admin takeover.
--
-- Fix: client requests may only create/update their own row with
-- role='user'. Admins are granted deliberately via direct SQL only
-- (the seeded 'Omar' admin row is untouched).
-- ================================================================

DROP POLICY IF EXISTS "profiles_insert_authenticated" ON public.profiles;
CREATE POLICY "profiles_insert_authenticated"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id AND role = 'user');

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'user');

-- Defense in depth: forbid role changes even if someone runs as the
-- table owner (which bypasses RLS) with a trigger on profiles.
CREATE OR REPLACE FUNCTION public.prevent_admin_escalation()
RETURNS trigger AS $$
BEGIN
  IF NEW.role IS DISTINCT FROM OLD.role AND OLD.role <> 'admin' AND NEW.role = 'admin' THEN
    RAISE EXCEPTION 'role promotion is only allowed via direct SQL';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_profiles_no_self_admin ON public.profiles;
CREATE TRIGGER trg_profiles_no_self_admin
  BEFORE UPDATE OF role ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_admin_escalation();