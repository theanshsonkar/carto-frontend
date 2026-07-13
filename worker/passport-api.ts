/**
 * Talks to the Carto AWS backend from the Cloudflare Worker.
 *
 * The browser calls our own same-origin `/api/passport?repo=…`; this module
 * signs a request to the dispatcher Lambda (via the Lambda Invoke API, since the
 * account blocks anonymous access) and returns the dispatcher's JSON verbatim:
 *
 *   { status: "done",    core }        → cached PassportCore, ready to render
 *   { status: "running" }              → parse in flight, client should poll
 *   { status: "error",   error }       → give up; client uses local generator
 *
 * We invoke the dispatcher (fast, never parses) synchronously — it internally
 * fires the heavy worker asynchronously and returns immediately.
 */

import { signRequest } from "./aws-sign";

const REGION = "ap-south-1";
const FUNCTION = "carto-passport-dispatcher";
const INVOKE_URL = `https://lambda.${REGION}.amazonaws.com/2015-03-31/functions/${FUNCTION}/invocations`;

export interface BackendEnv {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
}

export interface PassportResult {
  httpStatus: number; // status to relay to the browser
  body: unknown; // { status, core? , error? }
}

export async function fetchPassportFromBackend(
  repo: string,
  env: BackendEnv
): Promise<PassportResult> {
  if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY) {
    return { httpStatus: 500, body: { status: "error", error: "backend not configured" } };
  }

  // The dispatcher was written for a Lambda Function URL event; the Invoke API
  // hands the function this exact shape, so we mimic it.
  const event = {
    queryStringParameters: { repo },
    requestContext: { http: { method: "GET" } },
  };

  let resp: Response;
  try {
    const signed = await signRequest({
      method: "POST",
      url: INVOKE_URL,
      service: "lambda",
      region: REGION,
      body: JSON.stringify(event),
      creds: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
      extraHeaders: { "content-type": "application/json" },
    });
    resp = await fetch(signed);
  } catch (err) {
    return { httpStatus: 502, body: { status: "error", error: `backend unreachable: ${err}` } };
  }

  if (!resp.ok) {
    // Throttle / permission / service error from the Lambda API itself.
    return { httpStatus: 502, body: { status: "error", error: `backend ${resp.status}` } };
  }

  // Invoke API returns the function's return value: { statusCode, headers, body }.
  let payload: { statusCode?: number; body?: string } ;
  try {
    payload = (await resp.json()) as { statusCode?: number; body?: string };
  } catch {
    return { httpStatus: 502, body: { status: "error", error: "bad backend payload" } };
  }

  // A Lambda function ERROR (unhandled throw) has no statusCode; treat as error.
  if (payload.statusCode == null) {
    return { httpStatus: 502, body: { status: "error", error: "backend function error" } };
  }

  let inner: unknown;
  try {
    inner = typeof payload.body === "string" ? JSON.parse(payload.body) : payload.body;
  } catch {
    inner = { status: "error", error: "unparseable backend body" };
  }

  return { httpStatus: payload.statusCode, body: inner };
}
