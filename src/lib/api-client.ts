import { supabase } from "./supabase";

/**
 * Wrapper around fetch() that attaches the current user's Supabase access
 * token as a Bearer token, so API routes can verify who is actually
 * calling them instead of trusting a userId in the request body.
 */
export async function apiFetch(url: string, options: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (session?.access_token) {
    headers.set("Authorization", `Bearer ${session.access_token}`);
  }

  const response = await fetch(url, { ...options, headers });

  let data: unknown = null;
  try {
    data = await response.json();
  } catch {
    // no JSON body
  }

  if (!response.ok) {
    const message =
      (data as { error?: string } | null)?.error ||
      `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
