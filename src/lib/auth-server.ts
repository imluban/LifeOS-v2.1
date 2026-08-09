import { supabaseAdmin } from "./supabase-admin";

/**
 * Verifies the Supabase access token sent by the client in the
 * `Authorization: Bearer <token>` header and returns the authenticated
 * user. Every API route that touches user data MUST call this instead of
 * trusting a userId sent in the request body — otherwise any caller could
 * pass someone else's id and read/write their data.
 */
export async function getAuthenticatedUser(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7).trim()
    : "";

  if (!token) return null;

  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) return null;

  return data.user;
}
