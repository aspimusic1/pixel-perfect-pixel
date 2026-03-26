-- Fix: waitlist table exposes all rows (including emails) to unauthenticated users
-- via the "Public can count waitlist" policy (USING: true on public role).
--
-- Solution:
--   1. Drop the insecure public SELECT policy.
--   2. Create a SECURITY DEFINER function that returns only an integer count —
--      no row data, no emails, no roles are ever returned to the caller.
--   3. Grant EXECUTE on the function to the anon role so the coming-soon page
--      can still display the waitlist count without any data exposure.
--   4. Restrict direct table SELECT to admins and service_role only.

-- Step 1: Remove the insecure policy
DROP POLICY IF EXISTS "Public can count waitlist" ON public.waitlist;

-- Step 2: Create a SECURITY DEFINER count function
-- This runs with the privileges of the function owner (postgres/service),
-- bypassing RLS entirely, but returns ONLY a count — never raw rows.
CREATE OR REPLACE FUNCTION public.get_waitlist_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = 'public'
AS $$
  SELECT COUNT(*)::integer FROM public.waitlist;
$$;

-- Grant execute to anon (unauthenticated) and authenticated roles
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO anon;
GRANT EXECUTE ON FUNCTION public.get_waitlist_count() TO authenticated;

-- Step 3: Ensure admins can still SELECT full rows (for the admin panel)
DROP POLICY IF EXISTS "Admins can view waitlist" ON public.waitlist;
CREATE POLICY "Admins can view waitlist"
  ON public.waitlist FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Step 4: Ensure service_role retains full access
DROP POLICY IF EXISTS "Service role can manage waitlist" ON public.waitlist;
CREATE POLICY "Service role can manage waitlist"
  ON public.waitlist FOR SELECT
  TO service_role
  USING (true);

-- Step 5: Keep the existing INSERT policy for signups (idempotent)
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  TO public
  WITH CHECK (true);
