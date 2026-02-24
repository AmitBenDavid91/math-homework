// =============================================================
// מטלת דמיון משולשים — שרטוטים מדויקים עם חישוב גיאומטרי v2
// =============================================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7piOmLUYOo6AwkpragXdu2eyQiXmULIF4Dn9gticn_A4EO5v07Y5onA3Padas0zCB2w/exec';
const SHEET_NAME = 'דמיון משולשים';

/* ══════════════════════════════════════════════════════
   SVG Geometry Helpers — v2
   - lbl:  exterior angle bisector → always outside the angle
   - eLbl: edge-point label → perpendicular to edge, away from ref
   - seg:  measurement label → perpendicular, auto-flip away from ref
   ══════════════════════════════════════════════════════ */

const S = {
  lw  : '1.8',
  col : '#222',
  r   : 3.2,
  f   : 'Arial, Heebo, sans-serif',
  fs  : '16',
  ms  : '13',
};

const R = n => Math.round(n * 10) / 10;

/* ── Vertex dot ──────────────────────────────────── */
function dot(x, y) {
  return `<circle cx="${R(x)}" cy="${R(y)}" r="${S.r}" fill="${S.col}"/>`;
}

/* ── Vertex label — exterior angle bisector ──────── *
 *  vx,vy  = vertex                                   *
 *  n1x,n1y = first neighbor (adjacent vertex)         *
 *  n2x,n2y = second neighbor (adjacent vertex)        *
 *  Places label along the exterior bisector of the    *
 *  angle at V, guaranteeing it sits outside.          */
function lbl(vx, vy, n1x, n1y, n2x, n2y, txt, off) {
  off = off || 20;
  let d1x = n1x - vx, d1y = n1y - vy;
  let d2x = n2x - vx, d2y = n2y - vy;
  const l1 = Math.hypot(d1x, d1y) || 1;
  const l2 = Math.hypot(d2x, d2y) || 1;
  d1x /= l1; d1y /= l1;
  d2x /= l2; d2y /= l2;
  // interior bisector = sum of unit vectors; negate → exterior
  let bx = -(d1x + d2x), by = -(d1y + d2y);
  const bl = Math.hypot(bx, by);
  if (bl < 0.01) { bx = 0; by = -1; }
  else { bx /= bl; by /= bl; }
  return `<text x="${R(vx + bx * off)}" y="${R(vy + by * off)}"
    font-size="${S.fs}" font-weight="bold" fill="${S.col}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="${S.f}">${txt}</text>`;
}

/* ── Edge-point label — perpendicular to edge, away from ref ── *
 *  px,py       = the point on the edge                          *
 *  e1x…e2y     = the edge's two endpoints                       *
 *  rx,ry       = reference point to stay away from (e.g. opp.   *
 *                vertex)                                         */
function eLbl(px, py, e1x, e1y, e2x, e2y, rx, ry, txt, off) {
  off = off || 17;
  const dx = e2x - e1x, dy = e2y - e1y;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len, ny = dx / len;
  // flip so we point AWAY from the reference
  if ((rx - px) * nx + (ry - py) * ny > 0) { nx = -nx; ny = -ny; }
  return `<text x="${R(px + nx * off)}" y="${R(py + ny * off)}"
    font-size="${S.fs}" font-weight="bold" fill="${S.col}"
    text-anchor="middle" dominant-baseline="middle"
    font-family="${S.f}">${txt}</text>`;
}

/* ── Measurement text — midpoint of segment, away from ref ─── *
 *  x1…y2   = segment endpoints                                 *
 *  rx,ry   = reference point to stay away from                  */
function seg(x1, y1, x2, y2, rx, ry, txt, off, bold) {
  off = off || 15;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len, ny = dx / len;
  if ((rx - mx) * nx + (ry - my) * ny > 0) { nx = -nx; ny = -ny; }
  const fw = bold ? ' font-weight="bold"' : '';
  return `<text x="${R(mx + nx * off)}" y="${R(my + ny * off)}"
    font-size="${S.ms}" fill="${S.col}"${fw}
    text-anchor="middle" dominant-baseline="middle"
    font-family="${S.f}">${txt}</text>`;
}

/* ── Angle arc at vertex V between rays VA and VB ──── */
function arc(vx, vy, ax, ay, bx, by, r) {
  r = r || 24;
  const a1 = Math.atan2(ay - vy, ax - vx);
  const a2 = Math.atan2(by - vy, bx - vx);
  const x1 = vx + r * Math.cos(a1), y1 = vy + r * Math.sin(a1);
  const x2 = vx + r * Math.cos(a2), y2 = vy + r * Math.sin(a2);
  let d = a2 - a1;
  if (d > Math.PI)  d -= 2 * Math.PI;
  if (d < -Math.PI) d += 2 * Math.PI;
  const sweep = d > 0 ? 1 : 0;
  const large = Math.abs(d) > Math.PI ? 1 : 0;
  return `<path d="M ${R(x1)},${R(y1)} A ${r},${r} 0 ${large},${sweep} ${R(x2)},${R(y2)}"
    fill="none" stroke="${S.col}" stroke-width="1.2"/>`;
}

/* ── Double arc (second pair of equal angles) ──────── */
function arc2(vx, vy, ax, ay, bx, by, r) {
  r = r || 22;
  return arc(vx, vy, ax, ay, bx, by, r) + '\n    ' +
         arc(vx, vy, ax, ay, bx, by, r + 5);
}

/* ── Right-angle square at vertex V ──────────────── */
function sq(vx, vy, ax, ay, bx, by, s) {
  s = s || 12;
  const dA = { x: ax - vx, y: ay - vy };
  const dB = { x: bx - vx, y: by - vy };
  const lA = Math.hypot(dA.x, dA.y) || 1;
  const lB = Math.hypot(dB.x, dB.y) || 1;
  const uA = { x: dA.x / lA * s, y: dA.y / lA * s };
  const uB = { x: dB.x / lB * s, y: dB.y / lB * s };
  const p1x = vx + uA.x,            p1y = vy + uA.y;
  const p2x = vx + uA.x + uB.x,     p2y = vy + uA.y + uB.y;
  const p3x = vx + uB.x,            p3y = vy + uB.y;
  return `<polyline points="${R(p1x)},${R(p1y)} ${R(p2x)},${R(p2y)} ${R(p3x)},${R(p3y)}"
    fill="none" stroke="${S.col}" stroke-width="1.2"/>`;
}

/* ── Tick marks on segment (n = count) ───────────── */
function tick(x1, y1, x2, y2, n, sz) {
  n = n || 1; sz = sz || 6;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  const px = -uy, py = ux;
  let r = '';
  for (let i = 0; i < n; i++) {
    const off = (i - (n - 1) / 2) * 5;
    const cx = mx + ux * off, cy = my + uy * off;
    r += `<line x1="${R(cx - px * sz)}" y1="${R(cy - py * sz)}"
               x2="${R(cx + px * sz)}" y2="${R(cy + py * sz)}"
               stroke="${S.col}" stroke-width="1.5"/>`;
  }
  return r;
}

/* ── Centred text helper ─────────────────────────── */
function txt(x, y, str, opts) {
  opts = opts || {};
  const fw = opts.bold ? ' font-weight="bold"' : '';
  const fs = opts.size || S.ms;
  return `<text x="${R(x)}" y="${R(y)}" font-size="${fs}" fill="${S.col}"${fw}
    text-anchor="middle" dominant-baseline="middle"
    font-family="${S.f}">${str}</text>`;
}

/* ══════════════════════════════════════════════════════
   8 Diagram Functions — v2 with precise label placement
   ══════════════════════════════════════════════════════ */

/* ── Q1: Two similar triangles side by side ────────── */
function diagramTwoTriangles() {
  const A = [30, 185], B = [130, 25], C = [230, 185];
  const D = [290, 185], E = [370, 58], F = [450, 185];

  return `<svg viewBox="0 0 480 215" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC -->
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    ${dot(...A)}${lbl(...A, ...B, ...C, 'A')}
    ${dot(...B)}${lbl(...B, ...A, ...C, 'B')}
    ${dot(...C)}${lbl(...C, ...A, ...B, 'C')}
    ${arc(...A, ...B, ...C, 24)}
    ${arc2(...B, ...A, ...C, 22)}
    ${seg(...A, ...B, ...C, '12')}
    ${seg(...B, ...C, ...A, '15')}
    <!-- ~ -->
    <text x="258" y="118" font-size="28" fill="#999" font-family="serif">~</text>
    <!-- △DEF -->
    <polygon points="${D} ${E} ${F}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    ${dot(...D)}${lbl(...D, ...E, ...F, 'D')}
    ${dot(...E)}${lbl(...E, ...D, ...F, 'E')}
    ${dot(...F)}${lbl(...F, ...D, ...E, 'F')}
    ${arc(...D, ...E, ...F, 24)}
    ${arc2(...E, ...D, ...F, 22)}
    ${seg(...D, ...E, ...F, '8')}
    ${seg(...E, ...F, ...D, '?', 15, true)}
  </svg>`;
}

/* ── Q2: Parallel line DE ∥ BC inside △ABC ────────── */
function diagramParallelLine() {
  const A = [180, 18], B = [30, 225], C = [330, 225];
  const t = 0.6;
  const D = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
  const E = [A[0] + t * (C[0] - A[0]), A[1] + t * (C[1] - A[1])];

  return `<svg viewBox="0 0 370 255" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <line x1="${R(D[0])}" y1="${R(D[1])}" x2="${R(E[0])}" y2="${R(E[1])}" stroke="${S.col}" stroke-width="${S.lw}"/>
    ${tick(...D, ...E, 2, 5)}
    ${tick(...B, ...C, 2, 5)}
    ${arc(...A, ...B, ...C, 26)}
    ${dot(...A)}${lbl(...A, ...B, ...C, 'A')}
    ${dot(...B)}${lbl(...B, ...A, ...C, 'B')}
    ${dot(...C)}${lbl(...C, ...A, ...B, 'C')}
    ${dot(...D)}${eLbl(...D, ...A, ...B, ...C, 'D')}
    ${dot(...E)}${eLbl(...E, ...A, ...C, ...B, 'E')}
    ${seg(...A, ...D, ...C, 'AD = 6')}
    ${seg(...D, ...B, ...C, 'DB = 4')}
    ${seg(...A, ...E, ...B, 'AE = 9')}
    ${seg(...E, ...C, ...B, 'EC = ?', 15, true)}
  </svg>`;
}

/* ── Q3 / Q15: Right triangle + altitude to hypotenuse ── */
function diagramRightTriangleAlt() {
  const A = [50, 190], B = [155, 45], C = [330, 190], H = [155, 190];

  return `<svg viewBox="0 0 400 240" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <line x1="${B[0]}" y1="${B[1]}" x2="${H[0]}" y2="${H[1]}" stroke="${S.col}" stroke-width="1.4" stroke-dasharray="6,4"/>
    ${sq(...B, ...A, ...C, 13)}
    ${sq(...H, ...B, ...A, 12)}
    ${dot(...A)}${lbl(...A, ...B, ...C, 'A')}
    ${dot(...B)}${lbl(...B, ...A, ...C, 'B')}
    ${dot(...C)}${lbl(...C, ...A, ...B, 'C')}
    ${dot(...H)}${eLbl(...H, ...A, ...C, ...B, 'H')}
    ${txt((A[0] + H[0]) / 2, 222, 'AH = 9')}
    ${txt((H[0] + C[0]) / 2, 222, 'HC = 16')}
  </svg>`;
}

/* ── Q4: Shadow problem (practical application) ─────── */
function diagramShadow() {
  const pBase = [80, 182], pTop = [80, 112], pShad = [134, 182];
  const bBase = [328, 182], bTop = [328, 42], bShad = [420, 182];

  return `<svg viewBox="0 0 440 210" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <line x1="10" y1="182" x2="430" y2="182" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- person -->
    <line x1="${pBase[0]}" y1="${pBase[1]}" x2="${pTop[0]}" y2="${pTop[1]}" stroke="${S.col}" stroke-width="2.5"/>
    <circle cx="${pTop[0]}" cy="${R(pTop[1] - 6)}" r="7" fill="none" stroke="${S.col}" stroke-width="2"/>
    <line x1="${pBase[0]}" y1="184" x2="${pShad[0]}" y2="184" stroke="${S.col}" stroke-width="3" opacity="0.3"/>
    <line x1="${pTop[0]}" y1="${R(pTop[1] - 13)}" x2="${pShad[0]}" y2="${pShad[1]}" stroke="${S.col}" stroke-width="1.2" stroke-dasharray="5,4"/>
    ${sq(...pBase, ...pTop, ...pShad, 8)}
    <!-- building -->
    <rect x="290" y="${bTop[1]}" width="38" height="${bBase[1] - bTop[1]}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" rx="1"/>
    <line x1="${bBase[0]}" y1="184" x2="${bShad[0]}" y2="184" stroke="${S.col}" stroke-width="3" opacity="0.3"/>
    <line x1="${bBase[0]}" y1="${bTop[1]}" x2="${bShad[0]}" y2="${bShad[1]}" stroke="${S.col}" stroke-width="1.2" stroke-dasharray="5,4"/>
    ${sq(...bBase, ...bTop, ...bShad, 8)}
    <!-- labels -->
    ${txt(60, 150, '1.7 מ׳')}
    ${txt(107, 197, '2 מ׳')}
    ${txt(274, 115, '? מ׳', { bold: true })}
    ${txt(374, 197, '12 מ׳')}
  </svg>`;
}

/* ── Q5: Hourglass / butterfly ─────────────────────── */
function diagramHourglass() {
  const A = [80, 195], B = [240, 195], C = [40, 30], D = [280, 30];
  const P = [160, 129];

  return `<svg viewBox="0 0 320 225" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <line x1="${A[0]}" y1="${A[1]}" x2="${D[0]}" y2="${D[1]}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <line x1="${B[0]}" y1="${B[1]}" x2="${C[0]}" y2="${C[1]}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <line x1="${C[0]}" y1="${C[1]}" x2="${D[0]}" y2="${D[1]}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- ∠A ≅ ∠C (single arc) -->
    ${arc(...A, ...B, ...P, 22)}
    ${arc(...C, ...D, ...P, 22)}
    <!-- ∠B ≅ ∠D (double arc) -->
    ${arc2(...B, ...A, ...P, 20)}
    ${arc2(...D, ...C, ...P, 20)}
    <!-- vertices — lbl uses the two connected edges at each corner -->
    ${dot(...A)}${lbl(...A, ...B, ...D, 'A')}
    ${dot(...B)}${lbl(...B, ...A, ...C, 'B')}
    ${dot(...C)}${lbl(...C, ...D, ...B, 'C')}
    ${dot(...D)}${lbl(...D, ...C, ...A, 'D')}
    ${dot(...P)}${txt(P[0] + 15, P[1] + 5, 'P', { size: S.fs, bold: true })}
    <!-- measurements — each segment label placed away from the opposite diagonal -->
    ${seg(...A, ...P, ...B, 'AP = 4')}
    ${seg(...B, ...P, ...A, 'BP = 3')}
    ${seg(...C, ...P, ...D, 'CP = 6')}
    ${seg(...D, ...P, ...C, 'DP = ?', 15, true)}
  </svg>`;
}

/* ── Q6: Midsegment PQ ∥ BC ───────────────────────── */
function diagramMidsegment() {
  const A = [180, 18], B = [30, 220], C = [330, 220];
  const P = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2];
  const Q = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];

  return `<svg viewBox="0 0 360 250" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <line x1="${R(P[0])}" y1="${R(P[1])}" x2="${R(Q[0])}" y2="${R(Q[1])}" stroke="${S.col}" stroke-width="${S.lw}"/>
    ${tick(...A, ...P, 1, 7)}
    ${tick(...P, ...B, 1, 7)}
    ${tick(...A, ...Q, 1, 7)}
    ${tick(...Q, ...C, 1, 7)}
    ${tick(...P, ...Q, 2, 5)}
    ${tick(...B, ...C, 2, 5)}
    ${dot(...A)}${lbl(...A, ...B, ...C, 'A')}
    ${dot(...B)}${lbl(...B, ...A, ...C, 'B')}
    ${dot(...C)}${lbl(...C, ...A, ...B, 'C')}
    ${dot(...P)}${eLbl(...P, ...A, ...B, ...C, 'P')}
    ${dot(...Q)}${eLbl(...Q, ...A, ...C, ...B, 'Q')}
    ${txt((B[0] + C[0]) / 2, 242, 'BC = 18')}
    ${txt((P[0] + Q[0]) / 2, P[1] - 12, 'PQ = ?', { bold: true })}
  </svg>`;
}

/* ── Q12: DE ∥ BC, find BC ─────────────────────────── */
function diagramParallelCalc() {
  const A = [180, 18], B = [40, 240], C = [320, 240];
  const t = 1 / 3;
  const D = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
  const E = [A[0] + t * (C[0] - A[0]), A[1] + t * (C[1] - A[1])];

  return `<svg viewBox="0 0 370 268" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <line x1="${R(D[0])}" y1="${R(D[1])}" x2="${R(E[0])}" y2="${R(E[1])}" stroke="${S.col}" stroke-width="${S.lw}"/>
    ${tick(...D, ...E, 2, 5)}
    ${tick(...B, ...C, 2, 5)}
    ${arc(...A, ...B, ...C, 26)}
    ${dot(...A)}${lbl(...A, ...B, ...C, 'A')}
    ${dot(...B)}${lbl(...B, ...A, ...C, 'B')}
    ${dot(...C)}${lbl(...C, ...A, ...B, 'C')}
    ${dot(...D)}${eLbl(...D, ...A, ...B, ...C, 'D')}
    ${dot(...E)}${eLbl(...E, ...A, ...C, ...B, 'E')}
    ${seg(...A, ...D, ...C, 'AD = 5')}
    ${seg(...A, ...B, ...C, 'AB = 15', 28)}
    ${txt((D[0] + E[0]) / 2, D[1] - 14, 'DE = 7')}
    ${txt((B[0] + C[0]) / 2, 258, 'BC = ?', { bold: true })}
  </svg>`;
}

/* ── Q14: Trapezoid area (DE ∥ BC, AD:DB = 2:3) ───── */
function diagramTrapezoidArea() {
  const A = [180, 18], B = [40, 260], C = [320, 260];
  const t = 2 / 5;
  const D = [A[0] + t * (B[0] - A[0]), A[1] + t * (B[1] - A[1])];
  const E = [A[0] + t * (C[0] - A[0]), A[1] + t * (C[1] - A[1])];

  return `<svg viewBox="0 0 370 290" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <polygon points="${A} ${R(D[0])},${R(D[1])} ${R(E[0])},${R(E[1])}" fill="rgba(0,0,0,0.04)" stroke="none"/>
    <line x1="${R(D[0])}" y1="${R(D[1])}" x2="${R(E[0])}" y2="${R(E[1])}" stroke="${S.col}" stroke-width="${S.lw}"/>
    ${tick(...D, ...E, 2, 5)}
    ${tick(...B, ...C, 2, 5)}
    ${dot(...A)}${lbl(...A, ...B, ...C, 'A')}
    ${dot(...B)}${lbl(...B, ...A, ...C, 'B')}
    ${dot(...C)}${lbl(...C, ...A, ...B, 'C')}
    ${dot(...D)}${eLbl(...D, ...A, ...B, ...C, 'D')}
    ${dot(...E)}${eLbl(...E, ...A, ...C, ...B, 'E')}
    ${seg(...A, ...D, ...C, '2')}
    ${seg(...D, ...B, ...C, '3')}
    ${txt(180, 75, 'S = 16', { bold: true })}
    ${txt(180, 205, 'שטח טרפז = ?', { bold: true })}
  </svg>`;
}

/* ── Diagram map ────────────────────────────────── */
const DIAGRAMS = {
  twoTriangles:     diagramTwoTriangles,
  parallelLine:     diagramParallelLine,
  rightTriangleAlt: diagramRightTriangleAlt,
  shadow:           diagramShadow,
  hourglass:        diagramHourglass,
  midsegment:       diagramMidsegment,
  parallelCalc:     diagramParallelCalc,
  trapezoidArea:    diagramTrapezoidArea
};

/* ══════════════════════════════════════════════════════
   Questions — 15 שאלות (8 עם שרטוטים)
   ══════════════════════════════════════════════════════ */

const baseQuestions = [
  {
    id: 'q1',
    prompt: 'בשרטוט, \\(\\triangle ABC \\sim \\triangle DEF\\). נתון: \\(\\angle A=\\angle D\\), \\(\\angle B=\\angle E\\), \\(AB=12\\), \\(DE=8\\), \\(BC=15\\).<br>מצאו את \\(EF\\).',
    diagram: 'twoTriangles',
    options: ['10', '12', '20', '7.5'],
    correct: '10',
    explanation: 'יחס הדמיון: \\(\\frac{AB}{DE}=\\frac{12}{8}=\\frac{3}{2}\\). לכן \\(\\frac{BC}{EF}=\\frac{3}{2}\\) ⇒ \\(EF=\\frac{15 \\cdot 2}{3}=10\\).'
  },
  {
    id: 'q2',
    prompt: 'בשרטוט, \\(DE \\parallel BC\\). נתון: \\(AD=6\\), \\(DB=4\\), \\(AE=9\\).<br>מצאו את \\(EC\\).',
    diagram: 'parallelLine',
    options: ['6', '8', '4', '5'],
    correct: '6',
    explanation: 'קו מקביל חותך צלעות ביחס שווה: \\(\\frac{AD}{DB}=\\frac{AE}{EC}\\) ⇒ \\(\\frac{6}{4}=\\frac{9}{EC}\\) ⇒ \\(EC=6\\).'
  },
  {
    id: 'q3',
    prompt: 'במשולש ישר-זווית \\(ABC\\) כך ש-\\(\\angle B=90°\\), הורד גובה \\(BH\\) ליתר \\(AC\\).<br>נתון: \\(AH=9\\), \\(HC=16\\). מצאו את \\(BH\\).',
    diagram: 'rightTriangleAlt',
    options: ['12', '10', '15', '144'],
    correct: '12',
    explanation: 'בגובה ליתר: \\(BH^2 = AH \\cdot HC = 9 \\cdot 16 = 144\\) ⇒ \\(BH=12\\).<br>(ממוצע גיאומטרי: \\(\\triangle ABH \\sim \\triangle BCH\\)).'
  },
  {
    id: 'q4',
    prompt: 'אדם בגובה \\(1.7\\) מ׳ מטיל צל באורך \\(2\\) מ׳. בניין סמוך מטיל צל באורך \\(12\\) מ׳ באותו רגע.<br>מהו גובה הבניין?',
    diagram: 'shadow',
    options: ['10.2 מ׳', '8.5 מ׳', '14.1 מ׳', '6 מ׳'],
    correct: '10.2 מ׳',
    explanation: 'משולשי הצל דומים (ז.ז — זוויות השמש זהות).<br>\\(\\frac{1.7}{2}=\\frac{x}{12} \\Rightarrow x=\\frac{1.7 \\cdot 12}{2}=10.2\\) מ׳.'
  },
  {
    id: 'q5',
    prompt: 'בשרטוט, הישרים \\(AD\\) ו-\\(BC\\) נחתכים ב-\\(P\\). \\(\\angle APB=\\angle CPD\\) (קודקודיות) ו-\\(\\angle A=\\angle C\\).<br>נתון: \\(AP=4\\), \\(CP=6\\), \\(BP=3\\). מצאו את \\(DP\\).',
    diagram: 'hourglass',
    options: ['4.5', '5', '2', '8'],
    correct: '4.5',
    explanation: '\\(\\triangle APB \\sim \\triangle CPD\\) (ז.ז).<br>\\(\\frac{AP}{CP}=\\frac{BP}{DP}\\) ⇒ \\(\\frac{4}{6}=\\frac{3}{DP}\\) ⇒ \\(DP=4.5\\).'
  },
  {
    id: 'q6',
    prompt: 'בשרטוט, \\(P\\) ו-\\(Q\\) אמצעי הצלעות \\(AB\\) ו-\\(AC\\) בהתאמה. נתון: \\(BC=18\\).<br>מהו אורך \\(PQ\\)?',
    diagram: 'midsegment',
    options: ['9', '12', '6', '18'],
    correct: '9',
    explanation: 'קטע אמצעים מקביל לצלע השלישית ושווה לחציה: \\(PQ=\\frac{BC}{2}=\\frac{18}{2}=9\\).<br>(\\(\\triangle APQ \\sim \\triangle ABC\\) עם \\(k=\\frac{1}{2}\\)).'
  },
  {
    id: 'q7',
    prompt: 'נתון: \\(\\frac{AB}{DE}=\\frac{BC}{EF}=\\frac{AC}{DF}=2\\).<br>לפי איזה קריטריון המשולשים דומים?',
    options: ['צ.צ.צ — שלוש צלעות פרופורציונליות', 'ז.ז — שתי זוויות שוות', 'צ.ז.צ — שתי צלעות וזווית ביניהן', 'אי אפשר לקבוע'],
    correct: 'צ.צ.צ — שלוש צלעות פרופורציונליות',
    explanation: 'כאשר כל שלוש הצלעות פרופורציונליות ביחס קבוע, הדמיון הוא לפי קריטריון <strong>צ.צ.צ</strong>.'
  },
  {
    id: 'q8',
    prompt: 'יחס הדמיון בין שני משולשים הוא \\(3{:}5\\). מהו יחס השטחים?',
    options: ['\\(9{:}25\\)', '\\(3{:}5\\)', '\\(6{:}10\\)', '\\(27{:}125\\)'],
    correct: '\\(9{:}25\\)',
    explanation: 'יחס שטחים = ריבוע יחס הדמיון: \\(k^2=\\left(\\frac{3}{5}\\right)^2=\\frac{9}{25}\\).'
  },
  {
    id: 'q9',
    prompt: 'יחס השטחים בין שני משולשים דומים הוא \\(49{:}16\\). מהו יחס ההיקפים?',
    options: ['\\(7{:}4\\)', '\\(49{:}16\\)', '\\(14{:}8\\)', '\\(2401{:}256\\)'],
    correct: '\\(7{:}4\\)',
    explanation: 'יחס דמיון \\(= \\sqrt{\\frac{49}{16}}=\\frac{7}{4}\\).<br>יחס ההיקפים = יחס הדמיון = \\(7{:}4\\).'
  },
  {
    id: 'q10',
    prompt: 'היקף \\(\\triangle ABC\\) הוא \\(36\\) ס״מ. \\(\\triangle ABC \\sim \\triangle DEF\\) עם יחס דמיון \\(3{:}2\\)&ensp;(ABC גדול).<br>מהו היקף \\(\\triangle DEF\\)?',
    options: ['24 ס״מ', '54 ס״מ', '18 ס״מ', '12 ס״מ'],
    correct: '24 ס״מ',
    explanation: 'יחס היקפים = יחס הדמיון.<br>\\(P_{DEF}=36 \\cdot \\frac{2}{3}=24\\) ס״מ.'
  },
  {
    id: 'q11',
    prompt: 'איזה מידע <strong>אינו מספיק לבדו</strong> להוכחת דמיון משולשים?',
    options: ['זווית אחת שווה בלבד', 'שתי זוויות שוות (ז.ז)', 'שלוש צלעות פרופורציונליות (צ.צ.צ)', 'שתי צלעות פרופורציונליות + זווית ביניהן שווה (צ.ז.צ)'],
    correct: 'זווית אחת שווה בלבד',
    explanation: 'זווית אחת בלבד אינה מספיקה — ייתכנו משולשים שונים לגמרי עם זווית זהה.<br>נדרש לפחות ז.ז, צ.ז.צ, או צ.צ.צ.'
  },
  {
    id: 'q12',
    prompt: 'בשרטוט, \\(DE \\parallel BC\\). נתון: \\(AD=5\\), \\(AB=15\\), \\(DE=7\\).<br>מצאו את \\(BC\\).',
    diagram: 'parallelCalc',
    options: ['21', '15', '35', '10.5'],
    correct: '21',
    explanation: '\\(\\triangle ADE \\sim \\triangle ABC\\).<br>\\(\\frac{AD}{AB}=\\frac{DE}{BC}\\) ⇒ \\(\\frac{5}{15}=\\frac{7}{BC}\\) ⇒ \\(BC=21\\).'
  },
  {
    id: 'q13',
    prompt: '\\(\\triangle ABC \\sim \\triangle DEF\\), יחס דמיון \\(k=\\frac{1}{3}\\)&ensp;(ABC קטן יותר).<br>אם \\(S_{\\triangle ABC}=8\\), מצאו את \\(S_{\\triangle DEF}\\).',
    options: ['72', '24', '64', '48'],
    correct: '72',
    explanation: 'יחס שטחים \\(= k^2 = \\frac{1}{9}\\).<br>\\(\\frac{S_{ABC}}{S_{DEF}}=\\frac{1}{9}\\) ⇒ \\(S_{DEF}=8 \\cdot 9=72\\).'
  },
  {
    id: 'q14',
    prompt: 'בשרטוט, \\(DE \\parallel BC\\). נתון: \\(AD{:}DB=2{:}3\\). שטח \\(\\triangle ADE=16\\).<br>מצאו את שטח הטרפז \\(BCED\\).',
    diagram: 'trapezoidArea',
    options: ['84', '64', '100', '144'],
    correct: '84',
    explanation: '\\(AD{:}AB=2{:}5\\). יחס שטחים \\(=\\left(\\frac{2}{5}\\right)^2=\\frac{4}{25}\\).<br>\\(S_{\\triangle ABC}=16 \\cdot \\frac{25}{4}=100\\).<br>שטח הטרפז \\(=100-16=84\\).'
  },
  {
    id: 'q15',
    prompt: 'במשולש ישר-זווית \\(ABC\\) (\\(\\angle B=90°\\)), \\(BH\\) גובה ליתר \\(AC\\).<br>נתון: \\(AH=9\\), \\(HC=16\\). מצאו את \\(AB\\).',
    diagram: 'rightTriangleAlt',
    options: ['15', '12', '20', '25'],
    correct: '15',
    explanation: '\\(AC=AH+HC=25\\).<br>\\(AB^2=AH \\cdot AC=9 \\cdot 25=225\\) ⇒ \\(AB=15\\).<br>(\\(\\triangle ABH \\sim \\triangle ACB\\)).'
  }
];

/* ══════════════════════════════════════════════════════
   Quiz Logic — בניית השאלון, בדיקה, שליחה
   ══════════════════════════════════════════════════════ */

let questions = [];
let lastCheckData = null;

const quizContainer    = document.getElementById('quiz-container');
const submitBtn        = document.getElementById('btn-submit');
const retryBtn         = document.getElementById('btn-retry');
const sendBtn          = document.getElementById('btn-send');
const resultsBox       = document.getElementById('results');
const scoreLine        = document.getElementById('score-line');
const wrongList        = document.getElementById('wrong-list');
const studentNameInput = document.getElementById('student-name');
const nameError        = document.getElementById('name-error');

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuiz() {
  questions = baseQuestions.map(q => ({ ...q, options: shuffle(q.options) }));
  quizContainer.innerHTML = '';

  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `card-${q.id}`;

    let optionsHtml = '';
    q.options.forEach((opt, optIdx) => {
      const radioId = `r-${q.id}-${optIdx}`;
      optionsHtml += `
        <label class="option" for="${radioId}">
          <input type="radio" id="${radioId}" name="${q.id}" value="${opt}">
          <span>${opt}</span>
        </label>`;
    });

    const diagramHtml = (q.diagram && DIAGRAMS[q.diagram])
      ? `<div class="diagram-container">${DIAGRAMS[q.diagram]()}</div>`
      : '';

    card.innerHTML = `
      <div class="question-title">שאלה ${idx + 1}: ${q.prompt}</div>
      ${diagramHtml}
      <div class="options">${optionsHtml}</div>
      <div class="feedback" id="feedback-${q.id}"></div>
      <div class="explanation" id="explanation-${q.id}"></div>`;

    quizContainer.appendChild(card);
  });

  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    MathJax.typesetPromise([quizContainer]);
  }
}

function checkAnswers() {
  const studentName = studentNameInput.value.trim();
  if (!studentName) {
    nameError.style.display = 'block';
    nameError.textContent = 'יש להזין שם תלמיד/ה לפני בדיקה.';
    studentNameInput.focus();
    return;
  }
  nameError.style.display = 'none';

  let correctCount = 0;
  const wrongQuestions = [];
  const wrongDetails  = [];
  const questionStatusById = {};
  const questionOrder = questions.map(q => q.id);

  questions.forEach((q, idx) => {
    const feedback    = document.getElementById(`feedback-${q.id}`);
    const explanation = document.getElementById(`explanation-${q.id}`);
    const selected    = document.querySelector(`input[name="${q.id}"]:checked`);

    feedback.className   = 'feedback';
    feedback.textContent = '';
    explanation.innerHTML = '';

    const isCorrect = selected && selected.value === q.correct;

    if (isCorrect) {
      correctCount++;
      feedback.classList.add('ok');
      feedback.textContent = '✓ נכון!';
      questionStatusById[q.id] = 'נכון';
    } else {
      feedback.classList.add('bad');
      feedback.textContent = '✗ לא נכון';
      explanation.innerHTML = q.explanation || '';
      questionStatusById[q.id] = 'אין מענה נכון';
      wrongQuestions.push(q.id);
      wrongDetails.push(`שאלה ${idx + 1}`);
    }
  });

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  scoreLine.textContent = `ציון סופי: ${score}%  (${correctCount} מתוך ${totalQuestions})`;

  if (wrongQuestions.length) {
    const wrongNums = wrongQuestions.map(id => {
      const qIdx = questions.findIndex(q => q.id === id);
      return `שאלה ${qIdx + 1}`;
    });
    wrongList.innerHTML = `<strong>שאלות לתרגול נוסף:</strong> ${wrongNums.join(', ')}`;
  } else {
    wrongList.innerHTML = '<span class="all-correct">כל הכבוד! כל התשובות נכונות 🎉</span>';
  }

  resultsBox.classList.remove('hidden');
  lastCheckData = { studentName, score, totalQuestions, wrongQuestions, wrongDetails, questionOrder, questionStatusById };

  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    MathJax.typesetPromise();
  }

  if (score >= 90) { launchConfetti(); }
}

async function sendToGoogleSheets() {
  if (!lastCheckData) { checkAnswers(); if (!lastCheckData) return; }

  const payload = { ...lastCheckData, sheetName: SHEET_NAME };
  sendBtn.disabled = true;
  sendBtn.textContent = '📤 שולח...';

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    alert('התוצאות נשלחו בהצלחה לגיליון.');
  } catch (err) {
    alert('שגיאה בשליחת התוצאות: ' + err.message);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = '📤 שלח תוצאות לגיליון';
  }
}

function retryHomework() {
  resultsBox.classList.add('hidden');
  scoreLine.textContent = '';
  wrongList.innerHTML   = '';
  lastCheckData = null;
  buildQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function launchConfetti() {
  const colors = ['#2563eb','#dc2626','#f59e0b','#15803d','#7c3aed','#ec4899'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    el.style.animationDuration = (2 + Math.random() * 2) + 's';
    el.style.animationDelay = Math.random() * 1.5 + 's';
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  }
}

submitBtn.addEventListener('click', checkAnswers);
retryBtn.addEventListener('click', retryHomework);
sendBtn.addEventListener('click', sendToGoogleSheets);
studentNameInput.addEventListener('input', () => { nameError.style.display = 'none'; });

buildQuiz();
