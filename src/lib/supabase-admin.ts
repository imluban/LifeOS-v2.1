import { createClient } from "@supabase/supabase-js";

// This client uses the SERVICE ROLE key and bypasses Row Level Security.
// It must never be imported from a "use client" file or any code that
// ships to the browser — only from Next.js API routes / server code.
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
