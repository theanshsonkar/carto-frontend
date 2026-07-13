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
import { resolvePassport, type Passport } from "../components/package/passport-data";
import { boardingPassHtml } from "./boarding-pass-og";
import sgBold from "./fonts/SpaceGrotesk-Bold.ttf";
import sgMedium from "./fonts/SpaceGrotesk-Medium.ttf";
import gmRegular from "./fonts/GeistMono-Regular.ttf";
import gmSemiBold from "./fonts/GeistMono-SemiBold.ttf";

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

const FONTS = [
  { name: "Space Grotesk", data: sgBold, weight: 700, style: "normal" },
  { name: "Space Grotesk", data: sgMedium, weight: 500, style: "normal" },
  { name: "Geist Mono", data: gmRegular, weight: 400, style: "normal" },
  { name: "Geist Mono", data: gmSemiBold, weight: 600, style: "normal" },
];

const num = (n: number) => Math.round(n).toLocaleString("en-US");

/** Bump this whenever the image template changes so cached PNGs are invalidated. */
const TEMPLATE_VERSION = "1";

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/r.png") return await renderImage(url, ctx);
      if (url.pathname === "/r") return await injectMeta(request, env, url);
    } catch (err) {
      console.error("[worker] fallthrough after error:", err);
    }
    return env.ASSETS.fetch(request);
  },
};

/** Render /r.png?repo=... as the boarding-pass PNG, cached hard by repo+digest. */
async function renderImage(url: URL, ctx: ExecutionContext): Promise<Response> {
  const repo = (url.searchParams.get("repo") || "").trim();
  if (!repo) return new Response("missing ?repo", { status: 400 });

  const p = resolvePassport(repo);

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
async function injectMeta(request: Request, env: Env, url: URL): Promise<Response> {
  const assetRes = await env.ASSETS.fetch(request);
  const repo = (url.searchParams.get("repo") || "").trim();
  const ct = assetRes.headers.get("content-type") || "";
  if (!repo || !ct.includes("text/html")) return assetRes;

  const p = resolvePassport(repo);
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
