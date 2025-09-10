import { NextRequest } from "next/server";

const DEFAULT_URL = process.env.SPORTMONKS_URL ??
  "https://api.sportmonks.com/v3/football/livescores/inplay?api_token=0m3wQMYU2HJdR6FmEFIkeCPtQhCS42wogMnxfcTeFc9iktmiSiFlDj2gavhm&include=periods;scores;trends;participants;statistics&filters=fixtureStatisticTypes:34,42,43,44,45,52,58,83,98,99;trendTypes:34,42,43,44,45,52,58,83,98,99&timezone=Europe/London&populate=400";

const CORS_ALLOW_ORIGIN = process.env.CORS_ALLOW_ORIGIN || "*";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": CORS_ALLOW_ORIGIN,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Cache-Control": "no-store, max-age=0",
  };
}

export async function OPTIONS() {
  return new Response(null, { headers: corsHeaders() });
}

export async function GET(req: NextRequest) {
  // Optional: allow ?q= to override upstream URL (for debugging), else use default/env
  const { searchParams } = new URL(req.url);
  const upstream = searchParams.get("q") || DEFAULT_URL;

  try {
    const res = await fetch(upstream, { cache: "no-store" });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: true, message: err?.message || "Upstream fetch failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders() },
    });
  }
}
