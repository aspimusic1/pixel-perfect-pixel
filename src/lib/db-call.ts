import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Open a signed URL for a private storage file in a new tab.
 * Falls back to the raw value if it looks like a full URL (legacy data).
 */
export async function openSignedContract(filePath: string) {
  // Legacy rows may still hold full URLs
  if (filePath.startsWith("http")) {
    window.open(filePath, "_blank");
    return;
  }
  const { data, error } = await supabase.storage
    .from("contracts")
    .createSignedUrl(filePath, 3600);
  if (error || !data?.signedUrl) {
    toast.error("Could not load contract. Please try again.");
    return;
  }
  window.open(data.signedUrl, "_blank");
}

export async function downloadSignedContract(filePath: string) {
  if (filePath.startsWith("http")) {
    window.open(filePath, "_blank");
    return;
  }
  const { data, error } = await supabase.storage
    .from("contracts")
    .createSignedUrl(filePath, 3600);
  if (error || !data?.signedUrl) {
    toast.error("Could not download contract. Please try again.");
    return;
  }
  const link = document.createElement("a");
  link.href = data.signedUrl;
  link.download = `contract-${filePath.split("/").pop()}`;
  link.click();
}



/**
 * Wraps a Supabase query call with error handling.
 * Shows a toast on error and returns null.
 */
export async function dbCall<T>(
  query: PromiseLike<{ data: T; error: any }>
): Promise<T | null> {
  const { data, error } = await query;
  if (error) {
    console.error("[dbCall]", error);
    toast.error(error.message || "Something went wrong. Please try again.");
    return null;
  }
  return data;
}
