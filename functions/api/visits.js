import { readVisits } from "../lib/visits.js";

export async function onRequestGet(context) {
  try {
    const counts = await readVisits(context.env);
    return Response.json(
      {
        human: counts.human,
        ai: counts.ai,
        labels: {
          human: "24-hour browser cookies, estimated",
          ai: "requests with a recognized AI crawler user-agent, estimated",
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": "https://ptah-official.pages.dev",
        },
      },
    );
  } catch (error) {
    console.error("visit counter read failed", error);
    return Response.json(
      { error: "counter_unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
