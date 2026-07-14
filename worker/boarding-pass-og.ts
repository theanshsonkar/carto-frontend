/**
 * boarding-pass-og — builds a 1200x630 boarding-pass image as a Satori-ready
 * HTML string (workers-og parses HTML into satori nodes). This is a faithful
 * RE-IMPLEMENTATION of components/package/BoardingPass.tsx in the CSS subset
 * Satori supports (flexbox + inline styles + basic SVG/img; no Tailwind, no
 * animation, no emoji font). Keep it visually in sync with the live pass by
 * hand; it powers the README badge + the social unfurl.
 *
 * All data comes from the same Passport object the frontend uses, via
 * resolvePassport, so the image matches /r for the same repo.
 */
import { archetype, concentration, type Passport } from "../components/package/passport-data";

/* brand tokens (mirrors app/globals.css) */
const C = {
  paper: "#f4f1e9",
  panel: "#faf8f2",
  panel2: "#eeeade",
  ink: "#15140e",
  ink2: "#5c5a4f",
  ink3: "#9b9788",
  line: "#d6d1c2",
  line2: "#e4dfd1",
  route: "#1f4fd6",
  routeStrong: "#1745c6",
  signal: "#df2a1b",
  safe: "#2c7a4c",
};

/** MRZ filler glyph. Real passports use "<"; workers-og's HTML parser does not
 *  decode entities (it would print a literal "&lt;"), and a raw "<" breaks the
 *  parser — so we use the single left-angle "‹", which reads the same. */
const FILL = "\u2039"; // ‹

/**
 * Pre-generated QR for the landing URL (SITE_URL). The web pass QR always
 * points at the landing page — same for every repo — so a single baked SVG
 * (paper/ink toned, prolog-stripped, base64) works for all images and costs
 * nothing to render.
 */
const QR_DATA_URI =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzNyAzNyIgc2hhcGUtcmVuZGVyaW5nPSJjcmlzcEVkZ2VzIj48cGF0aCBmaWxsPSIjZjRmMWU5IiBkPSJNMCAwaDM3djM3SDB6Ii8+PHBhdGggc3Ryb2tlPSIjMTUxNDBlIiBkPSJNNCA0LjVoN20xIDBoMm0zIDBoMW0xIDBoMm01IDBoN000IDUuNWgxbTUgMGgxbTMgMGgxbTEgMGgxbTEgMGgxbTEgMGg1bTEgMGgxbTUgMGgxTTQgNi41aDFtMSAwaDNtMSAwaDFtMiAwaDFtNSAwaDFtMSAwaDRtMSAwaDFtMSAwaDNtMSAwaDFNNCA3LjVoMW0xIDBoM20xIDBoMW0xIDBoMW0yIDBoNm0xIDBoMm0yIDBoMW0xIDBoM20xIDBoMU00IDguNWgxbTEgMGgzbTEgMGgxbTEgMGgxbTEgMGg0bTEgMGg0bTMgMGgxbTEgMGgzbTEgMGgxTTQgOS41aDFtNSAwaDFtMSAwaDFtMyAwaDFtMSAwaDFtMSAwaDFtMSAwaDJtMiAwaDFtNSAwaDFNNCAxMC41aDdtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDFtMSAwaDdNMTIgMTEuNWg0bTIgMGgxbTEgMGgyTTQgMTIuNWgxbTMgMGgxbTEgMGgzbTEgMGgybTIgMGgybTEgMGgxbTEgMGg3bTIgMGgxTTQgMTMuNWgxbTIgMGgxbTQgMGgxbTMgMGgxbTEgMGgzbTUgMGg3TTQgMTQuNWgxbTEgMGgybTEgMGgybTEgMGgzbTIgMGg0bTMgMGgzbTEgMGgxbTMgMGgxTTQgMTUuNWgxbTIgMGgybTMgMGgxbTEgMGgxbTEgMGgxbTMgMGgzbTEgMGgxbTEgMGgybTEgMGgxbTEgMGgyTTUgMTYuNWgxbTQgMGgzbTMgMGgxbTMgMGgybTEgMGgzbTUgMGgxTTQgMTcuNWgxbTMgMGgybTIgMGgybTEgMGg4bTIgMGg4TTQgMTguNWgxbTEgMGgxbTEgMGgxbTEgMGgxbTIgMGgzbTIgMGgybTIgMGgxbTIgMGgybTIgMGgybTEgMGgxTTYgMTkuNWgxbTIgMGgxbTEgMGgxbTEgMGgybTYgMGgybTIgMGgxbTEgMGgybTIgMGgyTTQgMjAuNWgzbTMgMGgxbTQgMGgxbTMgMGgxbTEgMGgxbTIgMGgybTEgMGgxbTMgMGgxTTQgMjEuNWgxbTMgMGgxbTIgMGgxMm0yIDBoNW0xIDBoMk02IDIyLjVoMm0xIDBoM20xIDBoMW0xIDBoMW0yIDBoMm0yIDBoMW0zIDBoM20xIDBoMW0xIDBoMU03IDIzLjVoM20zIDBoMW0xIDBoMW0yIDBoMW0yIDBoMW0yIDBoNG0zIDBoMk00IDI0LjVoM20xIDBoMW0xIDBoMW0zIDBoM20zIDBoMm0xIDBoN20yIDBoMU0xMiAyNS41aDZtMSAwaDRtMSAwaDFtMyAwaDFtMyAwaDFNNCAyNi41aDdtMSAwaDJtMyAwaDRtMiAwaDJtMSAwaDFtMSAwaDNtMSAwaDFNNCAyNy41aDFtNSAwaDFtMiAwaDFtMSAwaDJtNCAwaDRtMyAwaDFtMiAwaDFNNCAyOC41aDFtMSAwaDNtMSAwaDFtMSAwaDhtMSAwaDFtMSAwaDdtMiAwaDFNNCAyOS41aDFtMSAwaDNtMSAwaDFtMiAwaDJtMSAwaDRtMiAwaDJtMSAwaDFtMSAwaDFtNCAwaDFNNCAzMC41aDFtMSAwaDNtMSAwaDFtMiAwaDRtMiAwaDNtMSAwaDNtMyAwaDRNNCAzMS41aDFtNSAwaDFtMiAwaDJtMiAwaDJtMSAwaDNtMSAwaDFtMiAwaDFtMSAwaDFtMSAwaDJNNCAzMi41aDdtMSAwaDNtMSAwaDFtMyAwaDJtMSAwaDZtMiAwaDEiLz48L3N2Zz4K";

function esc(s: string): string {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** 3-letter "airport code" from a name (same rule as BoardingPass.code3). */
function code3(s: string): string {
  const clean = s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return (clean.slice(0, 3) || "CTO").padEnd(3, "X");
}

/** Deterministic pass number from repo + commit (mirrors BoardingPass). */
function passportNo(p: Passport): string {
  let h = 0;
  for (const ch of p.repo + p.commit) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const s = h.toString(36).toUpperCase().padEnd(8, "0").slice(0, 8);
  return `${s.slice(0, 4)}-${s.slice(4)}`;
}

function gradeHex(health: number): string {
  return health >= 85 ? C.safe : health >= 72 ? C.route : C.signal;
}

const num = (n: number) => Math.round(n).toLocaleString("en-US");

/* ---- machine-readable zone (mirrors BoardingPass.mrz1/mrz2) ---- */
function padMrz(s: string, n = 46): string {
  return (s + FILL.repeat(n)).slice(0, n);
}
function cleanMrz(s: string): string {
  return s.toUpperCase().replace(/[^A-Z0-9]/g, FILL);
}
function mrz1(owner: string, name: string): string {
  return padMrz(`PC${FILL}CTO${FILL}${cleanMrz(owner)}${FILL}${FILL}${cleanMrz(name)}`);
}
function mrz2(p: Passport): string {
  const dg = cleanMrz(p.digest.replace("sha256:", "")).slice(0, 8);
  return padMrz(`${dg}${FILL}${p.files}F${FILL}${p.domainsCount}D${FILL}${p.crossDomain}X${FILL}${cleanMrz(p.grade)}`);
}

/** A labeled cell in the primary detail strip. */
function cell(label: string, value: string, tone: string, first: boolean): string {
  const border = first ? "" : `border-left:1px solid ${C.line2}; padding-left:20px;`;
  return `
    <div style="display:flex; flex-direction:column; flex-grow:1; flex-basis:0; ${border}">
      <div style="display:flex; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; color:${C.ink3};">${esc(label)}</div>
      <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:32px; line-height:1; margin-top:9px; color:${tone};">${esc(value)}</div>
    </div>`;
}

/** A labeled secondary field (nationality / source ref / authority / reindex). */
function field(label: string, value: string, light: boolean): string {
  const labelColor = light ? "rgba(244,241,233,0.6)" : C.ink3;
  const valueColor = light ? C.paper : C.ink;
  return `
    <div style="display:flex; flex-direction:column; flex-grow:1; flex-basis:0;">
      <div style="display:flex; font-size:11px; letter-spacing:1.6px; text-transform:uppercase; color:${labelColor};">${esc(label)}</div>
      <div style="display:flex; font-size:18px; font-weight:500; letter-spacing:0.5px; margin-top:6px; color:${valueColor};">${esc(value)}</div>
    </div>`;
}

export function boardingPassHtml(p: Passport): string {
  const a = archetype(p);
  const c = concentration(p);
  const [owner, name] = p.repo.split("/");
  const fromCode = code3(name || p.repo);
  const toCode = code3(a.title.replace(/^THE /, ""));
  const tone = gradeHex(p.health);
  const archTitle = a.title.replace(/^THE /, "");
  const primaryLang = p.languages[0]?.name ?? p.stack[0] ?? "n/a";
  const after = (p.reindexTax.split("→").map((s) => s.trim())[1] ?? "3µs").replace(/µ/g, "u");
  const digest = p.digest.length > 20 ? `${p.digest.slice(0, 18)}…` : p.digest;

  return `
  <div style="display:flex; flex-direction:row; width:1200px; height:630px; background:${C.paper}; color:${C.ink}; font-family:'Geist Mono';">

    <!-- ===== MAIN ===== -->
    <div style="display:flex; flex-direction:column; flex-grow:1; position:relative; border-right:2px dashed ${C.route};">

      <!-- header band -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:${C.route}; color:${C.paper}; padding:20px 40px;">
        <div style="display:flex; font-size:16px; letter-spacing:3px; text-transform:uppercase;">Carto Container Authority</div>
        <div style="display:flex; align-items:center;">
          <div style="display:flex; font-size:13px; letter-spacing:4px; text-transform:uppercase; color:rgba(244,241,233,0.8); margin-right:18px;">Boarding Pass</div>
          <div style="display:flex; border:2px solid rgba(244,241,233,0.6); padding:4px 16px; font-family:'Space Grotesk'; font-weight:700; font-size:26px; line-height:1;">${esc(p.grade)}</div>
        </div>
      </div>

      <!-- inspection stamp (rotated, sits in the top-right, grazing the code) -->
      <div style="display:flex; position:absolute; top:66px; right:18px; width:132px; height:132px; transform:rotate(-9deg);">
        <div style="display:flex; position:absolute; top:0; left:0; width:128px; height:128px; border:2px solid ${C.signal}; border-radius:50%; opacity:0.82;"></div>
        <div style="display:flex; position:absolute; top:8px; left:8px; width:112px; height:112px; border:1px solid ${C.signal}; border-radius:50%; opacity:0.82;"></div>
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; position:absolute; top:0; left:0; width:132px; height:132px; opacity:0.9;">
          <div style="display:flex; font-size:8px; letter-spacing:2px; text-transform:uppercase; color:${C.signal};">Carto · inspected</div>
          <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:44px; line-height:1; color:${C.signal}; margin:2px 0;">${esc(p.grade)}</div>
          <div style="display:flex; font-size:8px; letter-spacing:1.2px; text-transform:uppercase; color:${C.signal};">${esc(archTitle)}</div>
        </div>
      </div>

      <!-- body -->
      <div style="display:flex; flex-direction:column; flex-grow:1; justify-content:space-between; padding:34px 40px 30px 40px;">

        <!-- route row -->
        <div style="display:flex; align-items:flex-end; justify-content:space-between; padding-right:20px;">
          <div style="display:flex; flex-direction:column;">
            <div style="display:flex; font-size:13px; letter-spacing:2px; text-transform:uppercase; color:${C.ink3};">repository</div>
            <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:94px; line-height:0.86; letter-spacing:-3px;">${esc(fromCode)}</div>
            <div style="display:flex; font-size:15px; color:${C.ink2}; margin-top:8px;">${esc(`${owner}/${name}`)}</div>
          </div>

          <div style="display:flex; align-items:center; flex-grow:1; margin:0 18px 40px 18px;">
            <div style="display:flex; width:8px; height:8px; border-radius:50%; background:${C.route};"></div>
            <div style="display:flex; flex-grow:1; height:0; border-top:2px dashed rgba(31,79,214,0.5); margin:0 8px;"></div>
            <svg width="22" height="22" viewBox="0 0 24 24" style="margin:0 2px;"><path d="M22 12L3 4.5l3.2 7.5L3 19.5 22 12z" fill="${C.route}"></path></svg>
            <div style="display:flex; flex-grow:1; height:0; border-top:2px dashed rgba(223,42,27,0.5); margin:0 8px;"></div>
            <div style="display:flex; width:8px; height:8px; border-radius:50%; background:${C.signal};"></div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <div style="display:flex; font-size:13px; letter-spacing:2px; text-transform:uppercase; color:${C.ink3};">classified as</div>
            <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:94px; line-height:0.86; letter-spacing:-3px; color:${tone};">${esc(toCode)}</div>
            <div style="display:flex; font-size:15px; color:${C.ink2}; margin-top:8px;">${esc(a.title)}</div>
          </div>
        </div>

        <!-- primary detail strip -->
        <div style="display:flex; border-top:1px solid ${C.line}; padding-top:18px;">
          ${cell("concentration", `${c.pct}%`, C.ink, true)}
          ${cell("files", num(p.files), C.ink, false)}
          ${cell("domains", String(p.domainsCount), C.ink, false)}
          ${cell("blast", num(p.blast.count), C.signal, false)}
          ${cell("cross-domain", num(p.crossDomain), C.signal, false)}
          ${cell("p(incident)", p.risk.toFixed(2), tone, false)}
        </div>

        <!-- secondary fields -->
        <div style="display:flex; border-top:1px solid ${C.line}; padding-top:16px;">
          ${field("nationality", primaryLang, false)}
          ${field("source ref", `@${p.commit}`, false)}
          ${field("authority", "carto engine · v4", false)}
          ${field("reindex tax", `→ ${after}`, false)}
        </div>

        <!-- machine-readable zone -->
        <div style="display:flex; flex-direction:column; border-top:1px dashed ${C.ink3}; background:rgba(238,234,222,0.5); padding:10px 14px; margin-top:2px;">
          <div style="display:flex; font-size:14px; letter-spacing:2px; color:${C.ink2};">${esc(mrz1(owner || "", name || ""))}</div>
          <div style="display:flex; font-size:14px; letter-spacing:2px; color:${C.ink2}; margin-top:4px;">${esc(mrz2(p))}</div>
        </div>
      </div>
    </div>

    <!-- ===== STUB ===== -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; width:320px; background:${C.route}; color:${C.paper}; padding:32px 28px;">
      <div style="display:flex; font-size:13px; letter-spacing:3px; text-transform:uppercase; color:rgba(244,241,233,0.85);">Boarding Pass</div>

      <div style="display:flex; align-items:center; font-family:'Space Grotesk'; font-weight:700; font-size:32px; line-height:1;">
        <div style="display:flex;">${esc(fromCode)}</div>
        <div style="display:flex; color:rgba(244,241,233,0.55); margin:0 10px;">→</div>
        <div style="display:flex;">${esc(toCode)}</div>
      </div>

      ${field("gate / domain", c.name, true)}

      <!-- scannable QR + identity -->
      <div style="display:flex; align-items:flex-end;">
        <div style="display:flex; background:${C.paper}; border:1px solid ${C.ink}; padding:6px;">
          <img src="${QR_DATA_URI}" width="72" height="72" />
        </div>
        <div style="display:flex; flex-direction:column; margin-left:14px;">
          <div style="display:flex; font-size:10px; letter-spacing:1.4px; text-transform:uppercase; color:rgba(244,241,233,0.7);">scan → carto</div>
          <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:18px; letter-spacing:1px; margin-top:6px;">${esc(passportNo(p))}</div>
          <div style="display:flex; font-size:10px; letter-spacing:0.5px; color:rgba(244,241,233,0.7); margin-top:6px;">digest · ${esc(digest)}</div>
        </div>
      </div>
    </div>
  </div>`;
}
