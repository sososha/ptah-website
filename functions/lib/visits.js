const AI_USER_AGENT = /(GPTBot|ChatGPT-User|OAI-SearchBot|ClaudeBot|Claude-User|Claude-SearchBot|PerplexityBot|Perplexity-User|Google-Extended|Applebot-Extended|Amazonbot|CCBot|cohere-ai|Cohere|Diffbot|YouBot|meta-externalagent|facebookexternalhit)/i;
const OTHER_AUTOMATION = /(bot|crawler|spider|slurp|bingpreview|headless|lighthouse|pagespeed|monitoring|uptime)/i;
let schemaPromise;

export function classifyVisit(request) {
  const userAgent = request.headers.get("User-Agent") || "";
  if (AI_USER_AGENT.test(userAgent)) return "ai";
  if (OTHER_AUTOMATION.test(userAgent)) return "other";
  return "human";
}

export function hasDailyVisitCookie(request) {
  const cookies = request.headers.get("Cookie") || "";
  return cookies.split(";").some((entry) => entry.trim().startsWith("ptah_visit_day=1"));
}

function ensureSchema(env) {
  if (!schemaPromise) {
    schemaPromise = env.PTAH_VISITS.batch([
      env.PTAH_VISITS.prepare(
        "CREATE TABLE IF NOT EXISTS visit_counters (kind TEXT PRIMARY KEY, value INTEGER NOT NULL CHECK(value >= 0))",
      ),
      env.PTAH_VISITS.prepare(
        "INSERT OR IGNORE INTO visit_counters(kind, value) VALUES ('human', 0)",
      ),
      env.PTAH_VISITS.prepare(
        "INSERT OR IGNORE INTO visit_counters(kind, value) VALUES ('ai', 0)",
      ),
    ]);
  }
  return schemaPromise;
}

export async function incrementVisit(env, kind) {
  await ensureSchema(env);
  await env.PTAH_VISITS.prepare(
    "UPDATE visit_counters SET value = value + 1 WHERE kind = ?",
  ).bind(kind).run();
}

export async function readVisits(env) {
  await ensureSchema(env);
  const rows = await env.PTAH_VISITS.prepare(
    "SELECT kind, value FROM visit_counters WHERE kind IN ('human', 'ai')",
  ).all();

  return rows.results.reduce(
    (counts, row) => {
      counts[row.kind] = Number(row.value);
      return counts;
    },
    { human: 0, ai: 0 },
  );
}
