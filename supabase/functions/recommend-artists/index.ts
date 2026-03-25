import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const manusApiKey = Deno.env.get("MANUS_API_KEY");
    const manusApiUrl = Deno.env.get("MANUS_API_URL");

    if (!manusApiKey || !manusApiUrl) {
      return new Response(JSON.stringify({ error: "AI service not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = user.id;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { event_city, event_date, budget_min, budget_max, genres, event_type, notes } = await req.json();

    // Create AI task record
    const { data: taskRow } = await supabase.from("ai_tasks").insert({
      related_entity_type: "recommendation_request",
      related_entity_id: userId,
      provider: "manus",
      task_type: "recommend_artists",
      input_payload: { event_city, event_date, budget_min, budget_max, genres, event_type, notes },
      status: "processing",
    }).select("id").single();

    // Fetch available artists for context
    const { data: artists } = await supabase
      .from("profiles")
      .select("user_id, display_name, genre, city, state, rate_min, rate_max, bio, bookscore, streaming_stats, avatar_url, slug")
      .eq("role", "artist")
      .eq("profile_complete", true)
      .eq("suspended", false)
      .limit(100);

    const artistContext = (artists || []).map((a: any) => ({
      id: a.user_id,
      name: a.display_name,
      genre: a.genre,
      city: a.city,
      state: a.state,
      rate_min: a.rate_min,
      rate_max: a.rate_max,
      bookscore: a.bookscore,
    }));

    const prompt = `You are an AI booking agent for a live music marketplace. A promoter is looking for artists for their event. Analyze the following request and recommend the best matching artists from the available roster.

Event Details:
- City: ${event_city || "Not specified"}
- Date: ${event_date || "Not specified"}
- Budget: $${budget_min || 0} - $${budget_max || "unlimited"}
- Genres: ${genres?.join(", ") || "Any"}
- Event Type: ${event_type || "General"}
- Notes: ${notes || "None"}

Available Artists:
${JSON.stringify(artistContext, null, 2)}

Return a JSON array of up to 5 recommended artists with this structure:
[{
  "artist_id": "uuid",
  "reason": "Brief explanation of why this artist is a good match",
  "suggested_price": number,
  "confidence_score": number between 0 and 1,
  "rank": number starting from 1
}]

Only return the JSON array, no other text.`;

    const manusResponse = await fetch(manusApiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${manusApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are an expert music booking agent. Always respond with valid JSON arrays only." },
          { role: "user", content: prompt },
        ],
        stream: false,
      }),
    });

    if (!manusResponse.ok) {
      const errText = await manusResponse.text();
      console.error("Manus API error:", manusResponse.status, errText);

      await supabase.from("ai_tasks").update({
        status: "failed",
        error_message: `Manus API error: ${manusResponse.status}`,
        completed_at: new Date().toISOString(),
      }).eq("id", taskRow?.id);

      return new Response(JSON.stringify({ error: "AI service error", recommendations: [] }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const manusData = await manusResponse.json();
    const content = manusData.choices?.[0]?.message?.content || "[]";

    let recommendations: any[] = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : [];
    } catch {
      console.error("Failed to parse Manus response:", content);
      recommendations = [];
    }

    const recsToInsert = recommendations.map((rec: any) => ({
      recommended_artist_id: rec.artist_id,
      recommendation_reason: rec.reason,
      suggested_price: rec.suggested_price,
      confidence_score: rec.confidence_score,
      rank_order: rec.rank,
      requesting_user_id: userId,
      status: "pending",
    }));

    if (recsToInsert.length > 0) {
      await supabase.from("ai_recommendations").insert(recsToInsert);
    }

    await supabase.from("ai_tasks").update({
      status: "completed",
      output_payload: { recommendations_count: recommendations.length, recommendations },
      completed_at: new Date().toISOString(),
    }).eq("id", taskRow?.id);

    await supabase.from("activity_logs").insert({
      actor_type: "manus",
      actor_id: userId,
      action_type: "artist_recommendation",
      entity_type: "recommendation_request",
      entity_id: taskRow?.id,
      metadata: { event_city, genres, recommendations_count: recommendations.length },
    });

    const enriched = recommendations.map((rec: any) => {
      const artist = (artists || []).find((a: any) => a.user_id === rec.artist_id);
      return {
        ...rec,
        artist_name: artist?.display_name,
        artist_genre: artist?.genre,
        artist_city: artist?.city,
        artist_state: artist?.state,
        artist_avatar: artist?.avatar_url,
        artist_slug: artist?.slug,
        artist_rate_min: artist?.rate_min,
        artist_rate_max: artist?.rate_max,
        artist_bookscore: artist?.bookscore,
      };
    });

    return new Response(JSON.stringify({ recommendations: enriched }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("recommend-artists error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error", recommendations: [] }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
