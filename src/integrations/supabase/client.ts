import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Production project: ycqtqbecadarulohxvan
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ycqtqbecadarulohxvan.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InljcXRxYmVjYWRhcnVsb2h4dmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwNzY3ODMsImV4cCI6MjA4OTY1Mjc4M30.o0KqiooL8248tP_M7otCBvIjK4MMbkPaHE8jznoi81E";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
