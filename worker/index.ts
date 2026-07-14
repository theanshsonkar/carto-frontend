/**
 * Worker entry for the trycarto deploy. Fronts exactly two paths and falls
 * through to the static assets (./out) for everything else:
 *
 *   /r.png?repo=owner/name  ->  renders the repo's boarding pass as a PNG
 *                               (powers the README badge)
 *   /r?repo=owner/name      ->  serves the static /r shell but rewrites the
 *                               OG/Twitter meta to point at /r.png for THIS
 *                               repo (powers the Twitter/Slack/iMessage unfurl)
 *
 * Any error renders nothing fatal: we log and fall through to ASSETS.fetch, so
 * a render failure can never take the site down.
 */
import { ImageResponse } from "workers-og";
import { resolvePassport, finalize, type Passport, type PassportCore } from "../components/package/passport-data";
import { boardingPassHtml } from "./boarding-pass-og";
import { fetchPassportFromBackend } from "./passport-api";
import sgBold from "./fonts/SpaceGrotesk-Bold.ttf";
import sgMedium from "./fonts/SpaceGrotesk-Medium.ttf";
import gmRegular from "./fonts/GeistMono-Regular.ttf";
import gmSemiBold from "./fonts/GeistMono-SemiBold.ttf";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  // Tightly-scoped IAM key (invoke-only on the dispatcher), set as Cloudflare
  // secrets. Never exposed to the browser — the Worker signs on its behalf.
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
}

const FONTS = [
  { name: "Space Grotesk", data: sgBold, weight: 700, style: "normal" },
  { name: "Space Grotesk", data: sgMedium, weight: 500, style: "normal" },
  { name: "Geist Mono", data: gmRegular, weight: 400, style: "normal" },
  { name: "Geist Mono", data: gmSemiBold, weight: 600, style: "normal" },
];

const num = (n: number) => Math.round(n).toLocaleString("en-US");

/** Bump this whenever the image template changes so cached PNGs are invalidated. */
const TEMPLATE_VERSION = "5";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/api/passport") return await handlePassportApi(request, env, url, ctx);
      if (url.pathname === "/r.png") return await renderImage(url, env, ctx);
      if (url.pathname === "/r") return await injectMeta(request, env, url, ctx);
    } catch (err) {
      console.error("[worker] fallthrough after error:", err);
    }
    return env.ASSETS.fetch(request);
  },
};

/** GET /api/passport?repo=owner/name — same-origin proxy to the signed AWS backend. */
async function handlePassportApi(
  request: Request,
  env: Env,
  url: URL,
  ctx: ExecutionContext
): Promise<Response> {
  const CORS: Record<string, string> = {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET,OPTIONS",
    "content-type": "application/json",
  };
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  const repo = (url.searchParams.get("repo") || "").trim();
  if (!repo) return jsonRes({ status: "error", error: "missing ?repo" }, 400, CORS);

  // Best-effort per-IP rate limit (the robust layer is a Cloudflare dashboard
  // rate-limiting rule; this is a cheap in-Worker backstop).
  const ip = request.headers.get("cf-connecting-ip") || "anon";
  if (!(await allowRequest(ip))) {
    return jsonRes({ status: "error", error: "rate limited, slow down" }, 429, CORS);
  }

  // Edge cache: a "done" result is effectively immutable for a repo's current
  // HEAD, so cache briefly to absorb repeat loads + social crawlers.
  const cache = caches.default;
  const cacheKey = new Request(`https://cache.local/api/passport?repo=${encodeURIComponent(repo)}`);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const { httpStatus, body } = await fetchPassportFromBackend(repo, env);
  const bodyObj = body as { status?: string };

  if (httpStatus === 200 && bodyObj?.status === "done") {
    const cacheable = new Response(JSON.stringify(bodyObj), {
      status: 200,
      headers: { ...CORS, "cache-control": "public, max-age=3600" },
    });
    ctx.waitUntil(cache.put(cacheKey, cacheable.clone()));
    return cacheable;
  }

  // running / error / non-200 → never cache; let the client keep polling.
  return jsonRes(bodyObj, httpStatus, { ...CORS, "cache-control": "no-store" });
}

function jsonRes(obj: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(obj), { status, headers });
}

/**
 * Fixed-window per-IP limiter backed by the edge cache. Best-effort (not
 * strongly atomic) — good enough as a cheap abuse backstop for a demo.
 */
async function allowRequest(ip: string, limit = 40, windowSec = 60): Promise<boolean> {
  try {
    const cache = caches.default;
    const win = Math.floor(Date.now() / 1000 / windowSec);
    const key = new Request(`https://rl.local/${encodeURIComponent(ip)}/${win}`);
    const hit = await cache.match(key);
    let count = 0;
    if (hit) count = parseInt(await hit.text(), 10) || 0;
    if (count >= limit) return false;
    await cache.put(
      key,
      new Response(String(count + 1), { headers: { "cache-control": `max-age=${windowSec}` } })
    );
    return true;
  } catch {
    return true; // never block on limiter failure
  }
}

/**
 * Resolve a repo's PassportCore the SAME way the /r page does — from the
 * backend — so the shared image and unfurl can never disagree with the page.
 * Reuses the exact edge-cache key handlePassportApi writes, so a page view and
 * a social-crawler image hit share one cached backend result (≈ no extra AWS
 * calls in the common case). Returns null when the backend isn't "done" (cold
 * first parse) or is unreachable, so callers fall back to the deterministic
 * generator and the image always renders.
 */
async function resolveCore(repo: string, env: Env, ctx: ExecutionContext): Promise<PassportCore | null> {
  const cache = caches.default;
  const cacheKey = new Request(`https://cache.local/api/passport?repo=${encodeURIComponent(repo)}`);
  try {
    const hit = await cache.match(cacheKey);
    if (hit) {
      const data = (await hit.json().catch(() => null)) as { status?: string; core?: PassportCore } | null;
      if (data?.status === "done" && data.core) return data.core;
    }
    const { httpStatus, body } = await fetchPassportFromBackend(repo, env);
    const b = body as { status?: string; core?: PassportCore };
    if (httpStatus === 200 && b?.status === "done" && b.core) {
      // Populate the shared cache so page + image + meta all reuse this result.
      const cacheable = new Response(JSON.stringify(b), {
        status: 200,
        headers: { "content-type": "application/json", "cache-control": "public, max-age=3600" },
      });
      ctx.waitUntil(cache.put(cacheKey, cacheable));
      return b.core;
    }
  } catch (err) {
    console.error("[worker] resolveCore fell back to generator:", err);
  }
  return null;
}

/** Render /r.png?repo=... as the boarding-pass PNG, cached hard by repo+digest. */
async function renderImage(url: URL, env: Env, ctx: ExecutionContext): Promise<Response> {
  const repo = (url.searchParams.get("repo") || "").trim();
  if (!repo) return new Response("missing ?repo", { status: 400 });

  // Same source of truth as the /r page: backend core → finalize; generator only
  // as a last resort so the image always renders.
  const core = await resolveCore(repo, env, ctx);
  const p = core ? finalize(core) : resolvePassport(repo);

  const cache = caches.default;
  const cacheKey = new Request(
    `https://cache.local/r.png?repo=${encodeURIComponent(repo)}&d=${encodeURIComponent(p.digest)}&v=${TEMPLATE_VERSION}`
  );
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const image = new ImageResponse(boardingPassHtml(p), {
    width: 1200,
    height: 630,
    format: "png",
    fonts: FONTS as never,
  });

  const res = new Response(image.body, image);
  res.headers.set("content-type", "image/png");
  // hard cache: GitHub/camo and social crawlers refetch a lot; digest is in the key
  res.headers.set("cache-control", "public, max-age=86400, s-maxage=604800, immutable");
  ctx.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}

/** Serve the static /r HTML but swap in per-repo OG/Twitter meta. */
async function injectMeta(request: Request, env: Env, url: URL, ctx: ExecutionContext): Promise<Response> {
  const assetRes = await env.ASSETS.fetch(request);
  const repo = (url.searchParams.get("repo") || "").trim();
  const ct = assetRes.headers.get("content-type") || "";
  if (!repo || !ct.includes("text/html")) return assetRes;

  // Same source of truth as the /r page + the /r.png image.
  const core = await resolveCore(repo, env, ctx);
  const p = core ? finalize(core) : resolvePassport(repo);
  const image = `${url.origin}/r.png?repo=${encodeURIComponent(repo)}`;
  const pageUrl = `${url.origin}/r?repo=${encodeURIComponent(repo)}`;
  const title = `${p.repo}: ${p.grade} on Carto`;
  const desc = metaDescription(p);

  return new HTMLRewriter()
    .on('meta[property="og:image"]', new SetAttr("content", image))
    .on('meta[property="og:image:alt"]', new SetAttr("content", title))
    .on('meta[name="twitter:image"]', new SetAttr("content", image))
    .on('meta[property="og:title"]', new SetAttr("content", title))
    .on('meta[name="twitter:title"]', new SetAttr("content", title))
    .on('meta[property="og:description"]', new SetAttr("content", desc))
    .on('meta[name="twitter:description"]', new SetAttr("content", desc))
    .on('meta[property="og:url"]', new SetAttr("content", pageUrl))
    .on("title", new SetText(`${title}`))
    .transform(assetRes);
}

function metaDescription(p: Passport): string {
  return `${p.repo}: grade ${p.grade}, ${num(p.blast.count)}-file worst blast radius, ${num(
    p.crossDomain
  )} cross-domain imports. Packaged once by Carto so any AI tool knows what breaks before the diff lands.`;
}

class SetAttr {
  constructor(private attr: string, private value: string) {}
  element(el: Element) {
    el.setAttribute(this.attr, this.value);
  }
}

class SetText {
  constructor(private value: string) {}
  element(el: Element) {
    el.setInnerContent(this.value);
  }
}
