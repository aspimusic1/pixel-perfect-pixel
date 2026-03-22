import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing auth");

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify caller
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authErr } = await supabaseUser.auth.getUser();
    if (authErr || !user) throw new Error("Unauthorized");

    // Check admin role
    const { data: roleRow } = await supabaseAdmin
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleRow) throw new Error("Forbidden: not an admin");

    const { claim_id, action, rejection_reason } = await req.json();
    if (!claim_id || !["approve", "reject"].includes(action)) {
      throw new Error("Invalid payload");
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const updateData: Record<string, unknown> = { status: newStatus, reviewed_at: new Date().toISOString() };
    if (action === "reject" && rejection_reason) {
      // We don't have a rejection_reason column on artist_claims currently,
      // but we set status which triggers the approval trigger for 'approved'
    }

    const { error: updateErr } = await supabaseAdmin
      .from("artist_claims")
      .update({ status: newStatus, reviewed_at: new Date().toISOString() })
      .eq("id", claim_id);

    if (updateErr) throw updateErr;

    return new Response(JSON.stringify({ success: true, status: newStatus }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
