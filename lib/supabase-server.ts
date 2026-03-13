import { createClient } from "@supabase/supabase-js";

// db password : DOwMw7ffOxQGsr18
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
);
