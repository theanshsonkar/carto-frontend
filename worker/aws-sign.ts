/**
 * Minimal AWS Signature V4 signer using WebCrypto (SubtleCrypto).
 *
 * Zero dependencies, runs unchanged in Cloudflare Workers AND Node 18+ (both
 * expose `globalThis.crypto.subtle`). We only need to sign a single POST to the
 * Lambda Invoke API, so this is intentionally small — not a general AWS SDK.
 *
 * Why the CF Worker signs at all: the dispatcher Lambda is reachable only by an
 * authenticated AWS caller (the account blocks anonymous access), so the Worker
 * holds a tightly-scoped IAM key (invoke-only) and signs on the browser's
 * behalf. The key never reaches the browser.
 */

const enc = new TextEncoder();

function toHex(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let out = "";
  for (let i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, "0");
  return out;
}

async function sha256Hex(data: string): Promise<string> {
  return toHex(await crypto.subtle.digest("SHA-256", enc.encode(data)));
}

async function hmac(key: ArrayBuffer | Uint8Array, msg: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    key,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", cryptoKey, enc.encode(msg));
}

export interface AwsCreds {
  accessKeyId: string;
  secretAccessKey: string;
  sessionToken?: string;
}

export interface SignParams {
  method: string;
  url: string; // full https URL
  service: string; // e.g. "lambda"
  region: string; // e.g. "ap-south-1"
  body?: string;
  creds: AwsCreds;
  extraHeaders?: Record<string, string>;
}

/**
 * Returns a fully-signed `Request` ready to `fetch()`. Signs with the payload
 * hash, host, x-amz-date (+ optional session token) — the standard SigV4 set.
 */
export async function signRequest(p: SignParams): Promise<Request> {
  const { method, url, service, region, body = "", creds } = p;
  const u = new URL(url);

  const amzDate = new Date().toISOString().replace(/[:-]|\.\d{3}/g, ""); // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = await sha256Hex(body);

  // Header map is kept lowercase-keyed (SigV4 signs lowercase header names).
  const headers: Record<string, string> = {
    host: u.host,
    "x-amz-date": amzDate,
    "x-amz-content-sha256": payloadHash,
  };
  if (creds.sessionToken) headers["x-amz-security-token"] = creds.sessionToken;
  for (const [k, v] of Object.entries(p.extraHeaders || {})) headers[k.toLowerCase()] = v;

  const signedHeaderNames = Object.keys(headers).sort();
  const canonicalHeaders =
    signedHeaderNames.map((h) => `${h}:${headers[h].trim()}\n`).join("");
  const signedHeaders = signedHeaderNames.join(";");

  // Canonical query string (sorted, RFC3986-encoded).
  const params = [...u.searchParams.entries()].map(
    ([k, v]) => [rfc3986(k), rfc3986(v)] as [string, string]
  );
  params.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : 1));
  const canonicalQuery = params.map(([k, v]) => `${k}=${v}`).join("&");

  const canonicalRequest = [
    method,
    u.pathname,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    await sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = await hmac(enc.encode("AWS4" + creds.secretAccessKey), dateStamp);
  const kRegion = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  const kSigning = await hmac(kService, "aws4_request");
  const signature = toHex(await hmac(kSigning, stringToSign));

  const authorization =
    `AWS4-HMAC-SHA256 Credential=${creds.accessKeyId}/${scope}, ` +
    `SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return new Request(url, {
    method,
    headers: { ...headers, authorization },
    body: method === "GET" || method === "HEAD" ? undefined : body,
  });
}

function rfc3986(s: string): string {
  return encodeURIComponent(s).replace(
    /[!'()*]/g,
    (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase()
  );
}
