import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseClient: SupabaseClient | null = null;
let configPromise: Promise<{ url: string; anonKey: string }> | null = null;

async function fetchConfig() {
  const res = await fetch("/api/auth/config");
  if (!res.ok) throw new Error("Failed to fetch auth config");
  return res.json();
}

export async function getSupabaseClient(): Promise<SupabaseClient> {
  if (supabaseClient) return supabaseClient;
  if (!configPromise) configPromise = fetchConfig();
  const config = await configPromise;
  supabaseClient = createClient(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      storage: window.localStorage,
    },
  });
  return supabaseClient;
}
