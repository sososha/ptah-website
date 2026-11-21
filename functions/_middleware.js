import { classifyVisit, hasDailyVisitCookie, incrementVisit } from "./lib/visits.js";

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const requestedKind = classifyVisit(request);
  const isDocument = request.headers.get("Sec-Fetch-Dest") === "document"
    || request.headers.get("Accept")?.includes("text/html");
  const aiPaths = ["/", "/about.md", "/llms.txt", "/llms-full.txt"];
  const shouldCount = request.method === "GET" && (
    (requestedKind === "ai" && aiPaths.includes(url.pathname))
    || (requestedKind === "human" && url.pathname === "/" && isDocument)
  );
  const kind = shouldCount ? requestedKind : "other";
  const countHuman = kind === "human" && !hasDailyVisitCookie(request);

  if (kind === "ai" || countHuman) {
    try {
      await incrementVisit(env, kind);
    } catch (error) {
      console.error("visit counter increment failed", error);
    }
  }

  const response = await context.next();
  if (!countHuman) return response;

  const headers = new Headers(response.headers);
  headers.append(
    "Set-Cookie",
    "ptah_visit_day=1; Path=/; Max-Age=86400; Secure; HttpOnly; SameSite=Lax",
  );
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
