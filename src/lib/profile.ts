import { supabase } from "./supabase";

export interface Profile {
  id: string;
  full_name?: string | null;
  role?: string | null;
  vision?: string | null;
  net_worth_goal?: string | null;
  life_mission?: string | null;
  ambition_level?: string | null;
  primary_goal?: string | null;
  wealth_target?: string | null;
  focus_type?: string | null;
}

export async function getProfile(): Promise<Profile | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return data;
}

export async function saveProfile(values: Partial<Profile>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("You must be signed in to save your profile.");

  const { error } = await supabase.from("profiles").upsert({
    id: user.id,
    ...values,
  });

  if (error) throw error;
}
