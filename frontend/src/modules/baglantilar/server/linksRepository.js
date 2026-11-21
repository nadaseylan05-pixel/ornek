import "server-only";
import { createClient } from "@/lib/supabase/server";

const LINK_COLUMNS = "id, name, url, icon_letter, color, sort_order, system_key, active";

export async function getActiveLinks() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .select(LINK_COLUMNS)
    .eq("active", true)
    .order("sort_order")
    .order("name");

  if (error) throw error;
  return data ?? [];
}

export async function getNextSortOrder() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data?.sort_order ?? 0) + 1;
}

export async function createLink(link) {
  const supabase = await createClient();
  const { data, error } = await supabase.from("links").insert(link).select(LINK_COLUMNS).single();

  if (error) throw error;
  return data;
}

export async function updateLink(id, changes) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .update(changes)
    .eq("id", id)
    .select(LINK_COLUMNS)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Link not found or not editable");
  return data;
}

export async function deactivateLink(id) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("links")
    .update({ active: false })
    .eq("id", id)
    .eq("active", true)
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error("Link not found or already inactive");
}
