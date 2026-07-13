/**
 * boarding-pass-og — builds a 1200x630 boarding-pass image as a Satori-ready
 * HTML string (workers-og parses HTML into satori nodes). This is a faithful
 * RE-IMPLEMENTATION of components/package/BoardingPass.tsx in the CSS subset
 * Satori supports (flexbox + inline styles only, no Tailwind, no SVG/animation).
 * Keep it visually in sync with the live pass by hand; it is a separate surface.
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

/** A labeled cell in the detail strip. */
function cell(label: string, value: string, tone: string, first: boolean): string {
  const border = first ? "" : `border-left:1px solid ${C.line2}; padding-left:20px;`;
  return `
    <div style="display:flex; flex-direction:column; flex-grow:1; flex-basis:0; ${border}">
      <div style="display:flex; font-size:12px; letter-spacing:1.5px; text-transform:uppercase; color:${C.ink3};">${esc(label)}</div>
      <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:34px; line-height:1; margin-top:10px; color:${tone};">${esc(value)}</div>
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
  const after = (p.reindexTax.split("→").map((s) => s.trim())[1] ?? "3µs").replace(/µ/g, "u");
  const digest = p.digest.length > 26 ? `${p.digest.slice(0, 24)}…` : p.digest;

  return `
  <div style="display:flex; flex-direction:row; width:1200px; height:630px; background:${C.paper}; color:${C.ink}; font-family:'Geist Mono';">

    <!-- ===== MAIN ===== -->
    <div style="display:flex; flex-direction:column; flex-grow:1; border-right:2px dashed ${C.route};">

      <!-- header band -->
      <div style="display:flex; align-items:center; justify-content:space-between; background:${C.route}; color:${C.paper}; padding:22px 40px;">
        <div style="display:flex; font-size:16px; letter-spacing:3px; text-transform:uppercase;">Carto Container Authority</div>
        <div style="display:flex; align-items:center;">
          <div style="display:flex; font-size:13px; letter-spacing:4px; text-transform:uppercase; color:rgba(244,241,233,0.8); margin-right:18px;">Boarding Pass</div>
          <div style="display:flex; border:2px solid rgba(244,241,233,0.6); padding:4px 16px; font-family:'Space Grotesk'; font-weight:700; font-size:28px; line-height:1;">${esc(p.grade)}</div>
        </div>
      </div>

      <!-- body -->
      <div style="display:flex; flex-direction:column; flex-grow:1; justify-content:space-between; padding:44px 44px 36px 44px;">

        <!-- route row -->
        <div style="display:flex; align-items:flex-end; justify-content:space-between;">
          <div style="display:flex; flex-direction:column;">
            <div style="display:flex; font-size:13px; letter-spacing:2px; text-transform:uppercase; color:${C.ink3};">repository</div>
            <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:112px; line-height:0.86; letter-spacing:-3px;">${esc(fromCode)}</div>
            <div style="display:flex; font-size:15px; color:${C.ink2}; margin-top:8px;">${esc(`${owner}/${name}`)}</div>
          </div>

          <div style="display:flex; align-items:center; justify-content:center; flex-grow:1; padding:0 24px; margin-bottom:52px;">
            <div style="display:flex; width:56px; height:2px; background:${C.route};"></div>
            <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:30px; color:${C.route}; margin:0 10px;">›</div>
            <div style="display:flex; width:56px; height:2px; background:${C.signal};"></div>
          </div>

          <div style="display:flex; flex-direction:column; align-items:flex-end;">
            <div style="display:flex; font-size:13px; letter-spacing:2px; text-transform:uppercase; color:${C.ink3};">classified as</div>
            <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:112px; line-height:0.86; letter-spacing:-3px; color:${tone};">${esc(toCode)}</div>
            <div style="display:flex; font-size:15px; color:${C.ink2}; margin-top:8px;">${esc(archTitle)}</div>
          </div>
        </div>

        <!-- detail strip -->
        <div style="display:flex; border-top:1px solid ${C.line}; padding-top:22px;">
          ${cell("concentration", `${c.pct}%`, C.ink, true)}
          ${cell("files", num(p.files), C.ink, false)}
          ${cell("domains", String(p.domainsCount), C.ink, false)}
          ${cell("blast", num(p.blast.count), C.signal, false)}
          ${cell("cross-domain", num(p.crossDomain), C.signal, false)}
          ${cell("p(incident)", p.risk.toFixed(2), tone, false)}
        </div>

        <!-- footer -->
        <div style="display:flex; justify-content:space-between; font-size:13px; color:${C.ink3};">
          <div style="display:flex;">source @${esc(p.commit)}</div>
          <div style="display:flex;">reindex → ${esc(after)}</div>
          <div style="display:flex;">carto engine · v4</div>
        </div>
      </div>
    </div>

    <!-- ===== STUB ===== -->
    <div style="display:flex; flex-direction:column; justify-content:space-between; width:320px; background:${C.route}; color:${C.paper}; padding:34px 30px;">
      <div style="display:flex; font-size:13px; letter-spacing:3px; text-transform:uppercase; color:rgba(244,241,233,0.85);">Boarding Pass</div>

      <div style="display:flex; align-items:center; font-family:'Space Grotesk'; font-weight:700; font-size:46px; line-height:1;">
        <div style="display:flex;">${esc(fromCode)}</div>
        <div style="display:flex; color:rgba(244,241,233,0.55); margin:0 12px;">›</div>
        <div style="display:flex;">${esc(toCode)}</div>
      </div>

      <div style="display:flex; flex-direction:column;">
        <div style="display:flex; font-size:12px; letter-spacing:2px; text-transform:uppercase; color:rgba(244,241,233,0.6);">gate / domain</div>
        <div style="display:flex; font-size:20px; font-weight:500; margin-top:6px;">${esc(c.name)}</div>
      </div>

      <div style="display:flex; flex-direction:column;">
        <div style="display:flex; font-family:'Space Grotesk'; font-weight:700; font-size:22px; letter-spacing:2px;">${esc(passportNo(p))}</div>
        <div style="display:flex; font-size:11px; letter-spacing:1px; color:rgba(244,241,233,0.7); margin-top:8px;">${esc(digest)}</div>
        <div style="display:flex; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:rgba(244,241,233,0.7); margin-top:12px;">scan → carto</div>
      </div>
    </div>
  </div>`;
}
