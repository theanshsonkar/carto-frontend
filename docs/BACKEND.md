# How the "Package a repo" backend works (AWS + Cloudflare)

A plain-English tour of everything behind the `/r` page — what each piece does and
why. This is study notes, so it's public-safe: real account IDs, ARNs, and keys
are shown as `<PLACEHOLDER>`.

Region: `ap-south-1`. Everything is pay-per-use — nothing runs (or costs) while idle.

---

## The big picture

A visitor types a GitHub repo on the site. We clone it, run the real Carto engine
on it, and show the result — cached by commit so the same commit is instant next
time.

```
Browser (trycarto)
   │  GET /api/passport?repo=owner/name        (no AWS key — just a normal request)
   ▼
Cloudflare Worker  ── signs the request with a tiny AWS key, forwards it
   │
   ▼
AWS "dispatcher" Lambda  ── the fast doorman: is this repo cached?
   │        │
   │        ├─ cached "done"  → returns the saved result
   │        ├─ "running"      → "still working, poll again"
   │        └─ not seen yet   → starts the worker, returns "running"
   ▼
AWS "worker" Lambda  ── the slow chef: clone repo → run Carto → save result
   │
   ├─ saves JSON to S3
   └─ marks the job "done" in DynamoDB
```

The browser polls `/api/passport` every couple seconds until it flips to `done`,
then renders the passport. If anything fails, the site falls back to a
deterministic local preview so the page never breaks.

---

## The AWS pieces

### 1. Worker Lambda — `carto-passport-worker` (the chef)
- A **container image** Lambda (packs Node + git + the Carto engine + tree-sitter).
- Given `{repo, sha}`: clones the repo shallow, runs the real engine, writes the
  result JSON to S3, and marks the job `done` in DynamoDB.
- Beefy + slow: 3008 MB RAM, 300s timeout, 6 GB scratch disk. A big repo like
  supabase (~6,800 files) parses in ~95s.
- Runs **asynchronously** — nobody waits on the HTTP request for it.

### 2. Dispatcher Lambda — `carto-passport-dispatcher` (the doorman)
- A tiny, fast zip Lambda (256 MB, 15s). **Never clones or parses.**
- On each request: work out the repo's latest commit SHA, look it up in DynamoDB,
  and either return the cached result, say "running," or kick off the worker.
- This is what the Cloudflare Worker actually calls.

### 3. S3 bucket — `carto-passports-<ACCOUNT_ID>` (the pantry)
- Stores each result as `passports/{owner}/{repo}/{sha}.json`.
- Private (no public access). Old entries auto-delete after 90 days.

### 4. DynamoDB table — `carto-passport-cache` (the job board)
- One row per `repo@sha` with a `status` (`running` / `done` / `error`), where the
  S3 result lives, an attempt counter, and a TTL so stale rows clean themselves up.
- This is the source of truth for "is this repo already done?"

### 5. The self-healing net (so a crash can't jam a repo forever)
If the worker ever dies mid-job (timeout, out-of-memory), its row would be stuck at
`running` and every future visitor would be told "still working" forever. To prevent
that:
- The dispatcher treats a `running` row older than ~6 minutes as **dead** and
  **re-queues** it (up to 3 tries), then finally marks it `error` so the site falls
  back to its local preview instead of spinning.
- The worker's automatic retries are turned **off** (a 5-min timeout retried twice is
  just wasted money), and failures are sent to a **dead-letter queue**
  (`carto-passport-dlq`) so we have a record.

---

## The Cloudflare piece

### Why a "middleman" at all
The dispatcher only accepts **signed AWS requests** (the account blocks anonymous
access). Browsers can't sign — and we'd never put an AWS key in a browser. So the
**Cloudflare Worker signs on the browser's behalf**:

1. Browser calls our own `/api/passport?repo=…` (same origin — no CORS, no AWS in sight).
2. The Worker signs a call to the dispatcher using a **tiny, locked-down AWS key**
   (see below), stored as a Cloudflare **secret** — never exposed to the browser.
3. It also adds **per-IP rate limiting** and **edge caching** of `done` results, so
   popular repos are served straight from Cloudflare's edge without hitting AWS.

Files:
- `worker/aws-sign.ts` — dependency-free AWS SigV4 signing using WebCrypto.
- `worker/passport-api.ts` — signs + forwards to the backend, normalizes the reply.
- `worker/index.ts` — the `/api/passport` route (rate limit + cache).

### The signing key — `carto-cf-signer`
- A dedicated AWS **machine user** (not a login). Its *only* permission is to invoke
  the one dispatcher function. Nothing else — can't read data, delete, or touch billing.
- Why not the root/admin account? A leaked admin key = whole account gone. A leaked
  `carto-cf-signer` key = someone can trigger repo parses, and we rotate it in seconds.
  MFA doesn't protect a stored key, and root keys can't be scoped — so a tiny scoped
  key is the safe choice.
- Its Access Key ID + Secret are the two Cloudflare secrets:
  `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`.

> Note: AWS Lambda **Function URLs** with IAM auth had an authorization quirk in this
> account, so the Worker calls the dispatcher through the standard **Lambda Invoke
> API** instead. Same security, same cost.

---

## The frontend wiring
- `components/package/passport-data.ts`
  - `resolvePassport(repo)` — synchronous local generator/preset (used for the instant
    OG image + as the fallback).
  - `resolvePassportAsync(repo)` — fetches `/api/passport`, polls `running → done`, and
    falls back to the generator on error/timeout.
- `app/r/page.tsx` — the `/r` page runs the scan animation while the real backend works,
  then reveals the real passport.
- The OG image (`/r.png`) and social meta keep using the instant generator so link
  previews render immediately for crawlers.

---

## Cost (why it's basically free)
- Idle: ~$0.19/mo (just the stored container image). Nothing else runs when unused.
- Per fresh parse: ~$0.0015. Cached repos: effectively free.
- DynamoDB / S3 / SQS at this volume: within free tiers / pennies.
- A budget alarm is set at $1 / $5.

## Teardown (if ever needed)
Delete: dispatcher Lambda (+ its URL), worker Lambda, ECR image repo, DynamoDB table,
S3 bucket (empty first), SQS DLQ, the two IAM roles + the `carto-cf-signer` user, and
the two CloudWatch log groups. Everything is tagged `project=Carto`.
