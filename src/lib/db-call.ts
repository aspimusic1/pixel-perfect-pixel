import { toast } from "sonner";

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
