-- Fix permissive RLS policies flagged by the Supabase linter.
-- All SELECT USING(true) policies are intentionally excluded per linter rules —
-- they are deliberate public read policies for browse pages.
-- Only INSERT/UPDATE/DELETE/ALL policies with WITH CHECK(true) or USING(true)
-- on non-service-role contexts are addressed here.

-- ============================================================
-- 1. notifications: "Authenticated can insert notifications"
--    Problem: Any authenticated user can insert a notification for any user_id.
--    Fix: Restrict to service_role only (notifications are system-generated).
-- ============================================================
DROP POLICY IF EXISTS "Authenticated can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;
DROP POLICY IF EXISTS "Only service role can insert notifications" ON public.notifications;

CREATE POLICY "Only service role can insert notifications"
  ON public.notifications FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================
-- 2. presale_signups: "Anyone can insert presale signups"
--    Problem: WITH CHECK(true) on public role — no validation at all.
--    Fix: Keep public INSERT (it's a sign-up form) but add a CHECK that
--    the email field is non-empty to prevent blank/spam rows.
-- ============================================================
DROP POLICY IF EXISTS "Anyone can insert presale signups" ON public.presale_signups;

CREATE POLICY "Anyone can insert presale signups"
  ON public.presale_signups FOR INSERT
  TO public
  WITH CHECK (email IS NOT NULL AND email <> '');

-- ============================================================
-- 3. waitlist: "Anyone can join waitlist"
--    Problem: WITH CHECK(true) on public role — no validation.
--    Fix: Keep public INSERT but require non-empty email.
-- ============================================================
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can insert into waitlist" ON public.waitlist;

CREATE POLICY "Anyone can join waitlist"
  ON public.waitlist FOR INSERT
  TO public
  WITH CHECK (email IS NOT NULL AND email <> '');
