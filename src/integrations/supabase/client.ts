import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Live production project: xsvamqzhdrhmznocgbxe
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xsvamqzhdrhmznocgbxe.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhzdmFtcXpoZHJobXpub2NnYnhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwODE4MjQsImV4cCI6MjA4OTY1NzgyNH0.5qnHcaOeDkcJPV1Wg88cl_YD3jrSgdJDjr9L_YaocV8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
