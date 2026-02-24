// =============================================================
// מטלת דמיון משולשים — שרטוטים מדויקים עם חישוב גיאומטרי
// =============================================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7piOmLUYOo6AwkpragXdu2eyQiXmULIF4Dn9gticn_A4EO5v07Y5onA3Padas0zCB2w/exec';
const SHEET_NAME = 'דמיון משולשים';

/* ══════════════════════════════════════════════════════
   SVG Geometry Helpers — חישוב מדויק של קשתות, זוויות, תוויות
   ══════════════════════════════════════════════════════ */

const S = {                           // style tokens
  lw  : '1.8',                        // line stroke-width
  col : '#222',                        // primary colour
  r   : 3.2,                          // vertex dot radius
  f   : 'Arial, Heebo, sans-serif',   // font-family
  fs  : '16',                         // label font-size
  ms  : '13',                         // measurement font-size
};

/* round to 1 decimal */
const R = n => Math.round(n * 10) / 10;

/* ── Vertex dot ───────────────────────────────────── */
function dot(x, y) {
  return `<circle cx="${R(x)}" cy="${R(y)}" r="${S.r}" fill="${S.col}"/>`;
}

/* ── Label placed away from a reference point (centroid) ── */
function lbl(vx, vy, cx, cy, txt, off) {
  off = off || 18;
  const dx = vx - cx, dy = vy - cy;
  const len = Math.hypot(dx, dy) || 1;
  const x = vx + dx / len * off;
  const y = vy + dy / len * off;
  return `<text x="${R(x)}" y="${R(y)}" font-size="${S.fs}" font-weight="bold"
    fill="${S.col}" text-anchor="middle" dominant-baseline="middle"
    font-family="${S.f}">${txt}</text>`;
}

/* ── Centroid of three points ─────────────────────── */
function cen(ax,ay,bx,by,cx,cy) {
  return [(ax+bx+cx)/3, (ay+by+cy)/3];
}

/* ── Measurement text along segment midpoint ──────── */
function seg(x1,y1,x2,y2, txt, off, bold) {
  off = off || 14;
  const mx = (x1+x2)/2, my = (y1+y2)/2;
  const dx = x2-x1, dy = y2-y1;
  const len = Math.hypot(dx,dy) || 1;
  const px = -dy/len, py = dx/len;            // perpendicular
  const x = mx + px*off, y = my + py*off;
  const fw = bold ? ' font-weight="bold"' : '';
  return `<text x="${R(x)}" y="${R(y)}" font-size="${S.ms}" fill="${S.col}"${fw}
    text-anchor="middle" dominant-baseline="middle" font-family="${S.f}">${txt}</text>`;
}

/* ── Angle arc at vertex V between rays VA and VB ─── */
function arc(vx,vy, ax,ay, bx,by, r) {
  r = r || 18;
  const a1 = Math.atan2(ay-vy, ax-vx);
  const a2 = Math.atan2(by-vy, bx-vx);
  const x1 = vx + r*Math.cos(a1), y1 = vy + r*Math.sin(a1);
  const x2 = vx + r*Math.cos(a2), y2 = vy + r*Math.sin(a2);
  let d = a2 - a1;
  if (d > Math.PI)  d -= 2*Math.PI;
  if (d < -Math.PI) d += 2*Math.PI;
  const sweep = d > 0 ? 1 : 0;
  const large = Math.abs(d) > Math.PI ? 1 : 0;
  return `<path d="M ${R(x1)},${R(y1)} A ${r},${r} 0 ${large},${sweep} ${R(x2)},${R(y2)}"
    fill="none" stroke="${S.col}" stroke-width="1.2"/>`;
}

/* ── Double arc (for second pair of equal angles) ─── */
function arc2(vx,vy, ax,ay, bx,by, r) {
  r = r || 18;
  return arc(vx,vy,ax,ay,bx,by, r) + arc(vx,vy,ax,ay,bx,by, r+5);
}

/* ── Right-angle square at vertex V ──────────────── */
function sq(vx,vy, ax,ay, bx,by, s) {
  s = s || 12;
  const dA = {x:ax-vx, y:ay-vy}, dB = {x:bx-vx, y:by-vy};
  const lA = Math.hypot(dA.x,dA.y)||1, lB = Math.hypot(dB.x,dB.y)||1;
  const uA = {x:dA.x/lA*s, y:dA.y/lA*s};
  const uB = {x:dB.x/lB*s, y:dB.y/lB*s};
  const p1x=vx+uA.x,     p1y=vy+uA.y;
  const p2x=vx+uA.x+uB.x,p2y=vy+uA.y+uB.y;
  const p3x=vx+uB.x,     p3y=vy+uB.y;
  return `<polyline points="${R(p1x)},${R(p1y)} ${R(p2x)},${R(p2y)} ${R(p3x)},${R(p3y)}"
    fill="none" stroke="${S.col}" stroke-width="1.2"/>`;
}

/* ── Tick marks on segment midpoint (n=count) ────── */
function tick(x1,y1,x2,y2, n, sz) {
  n = n||1; sz = sz||6;
  const mx=(x1+x2)/2, my=(y1+y2)/2;
  const dx=x2-x1, dy=y2-y1;
  const len = Math.hypot(dx,dy)||1;
  const ux=dx/len, uy=dy/len;
  const px=-uy, py=ux;             // perpendicular
  let r = '';
  for (let i=0; i<n; i++) {
    const off = (i - (n-1)/2) * 5;
    const cx = mx + ux*off, cy = my + uy*off;
    r += `<line x1="${R(cx-px*sz)}" y1="${R(cy-py*sz)}"
               x2="${R(cx+px*sz)}" y2="${R(cy+py*sz)}"
               stroke="${S.col}" stroke-width="1.5"/>`;
  }
  return r;
}

/* ── Centered text helper ────────────────────────── */
function txt(x,y, str, opts) {
  opts = opts || {};
  const fw = opts.bold ? ' font-weight="bold"' : '';
  const fs = opts.size || S.ms;
  return `<text x="${R(x)}" y="${R(y)}" font-size="${fs}" fill="${S.col}"${fw}
    text-anchor="middle" dominant-baseline="middle" font-family="${S.f}">${str}</text>`;
}

/* ══════════════════════════════════════════════════════
   8 Diagram Functions — all geometry computed precisely
   ══════════════════════════════════════════════════════ */

/* ── Q1: Two similar triangles — side by side ──────── */
function diagramTwoTriangles() {
  // △ABC (large)
  const A=[20,185], B=[120,30], C=[220,185];
  const c1 = cen(...A,...B,...C);
  // △DEF (small)
  const D=[295,185], E=[370,68], F=[445,185];
  const c2 = cen(...D,...E,...F);

  return `<svg viewBox="0 0 480 210" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC -->
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    ${dot(...A)}${lbl(...A,...c1,'A')}
    ${dot(...B)}${lbl(...B,...c1,'B')}
    ${dot(...C)}${lbl(...C,...c1,'C')}
    <!-- ∠A = ∠D (single arc) -->
    ${arc(...A,...B,...C)}
    <!-- ∠B = ∠E (double arc) -->
    ${arc2(...B,...A,...C)}
    <!-- side labels -->
    ${seg(...A,...B,'12', -14)}
    ${seg(...B,...C,'15', 14)}
    <!-- ~ -->
    <text x="258" y="118" font-size="28" fill="#999" font-family="serif">~</text>
    <!-- △DEF -->
    <polygon points="${D} ${E} ${F}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    ${dot(...D)}${lbl(...D,...c2,'D')}
    ${dot(...E)}${lbl(...E,...c2,'E')}
    ${dot(...F)}${lbl(...F,...c2,'F')}
    <!-- ∠D = ∠A (single arc) -->
    ${arc(...D,...E,...F)}
    <!-- ∠E = ∠B (double arc) -->
    ${arc2(...E,...D,...F)}
    <!-- side labels -->
    ${seg(...D,...E,'8', -14)}
    ${seg(...E,...F,'?', 14, true)}
  </svg>`;
}

/* ── Q2: Parallel line DE ∥ BC inside △ABC ────────── */
function diagramParallelLine() {
  const A=[180,18], B=[30,225], C=[330,225];
  // D on AB at 60%, E on AC at 60%
  const t = 0.6;
  const D=[A[0]+t*(B[0]-A[0]), A[1]+t*(B[1]-A[1])]; // (90,142.2)
  const E=[A[0]+t*(C[0]-A[0]), A[1]+t*(C[1]-A[1])]; // (270,142.2)
  const c1 = cen(...A,...B,...C);

  return `<svg viewBox="0 0 360 250" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- outer triangle -->
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <!-- DE segment -->
    <line x1="${R(D[0])}" y1="${R(D[1])}" x2="${R(E[0])}" y2="${R(E[1])}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- parallel marks on DE and BC -->
    ${tick(...D,...E, 2, 5)}
    ${tick(...B,...C, 2, 5)}
    <!-- shared angle at A -->
    ${arc(...A,...B,...C, 22)}
    <!-- vertices -->
    ${dot(...A)}${lbl(...A,...c1,'A')}
    ${dot(...B)}${lbl(...B,...c1,'B')}
    ${dot(...C)}${lbl(...C,...c1,'C')}
    ${dot(...D)}<text x="${R(D[0]-16)}" y="${R(D[1]-2)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">D</text>
    ${dot(...E)}<text x="${R(E[0]+16)}" y="${R(E[1]-2)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">E</text>
    <!-- measurements -->
    ${seg(...A,...D,'AD = 6', -18)}
    ${seg(...D,...B,'DB = 4', -18)}
    ${seg(...A,...E,'AE = 9', 18)}
    ${seg(...E,...C,'EC = ?', 18, true)}
  </svg>`;
}

/* ── Q3/Q15: Right triangle + altitude to hypotenuse ── */
function diagramRightTriangleAlt() {
  const A=[50,190], B=[155,45], C=[330,190], H=[155,190];

  return `<svg viewBox="0 0 400 230" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- triangle -->
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <!-- altitude BH dashed -->
    <line x1="${B[0]}" y1="${B[1]}" x2="${H[0]}" y2="${H[1]}" stroke="${S.col}" stroke-width="1.4" stroke-dasharray="6,4"/>
    <!-- precise right-angle at B (∠ABC = 90°) -->
    ${sq(...B,...A,...C, 13)}
    <!-- precise right-angle at H (∠BHA = 90°) -->
    ${sq(...H,...B,...A, 12)}
    <!-- vertices -->
    ${dot(...A)}${lbl(...A, 178,140,'A', 20)}
    ${dot(...B)}${lbl(...B, 178,140,'B', 20)}
    ${dot(...C)}${lbl(...C, 178,140,'C', 20)}
    ${dot(...H)}<text x="${R(H[0]+10)}" y="${R(H[1]+16)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">H</text>
    <!-- measurements -->
    ${txt((A[0]+H[0])/2, 218, 'AH = 9')}
    ${txt((H[0]+C[0])/2, 218, 'HC = 16')}
  </svg>`;
}

/* ── Q4: Shadow problem (practical application) ─────── */
function diagramShadow() {
  // Person: base (80,182), top (80,112), shadow tip (134,182)
  // Building: base-right (328,182), top-right (328,42), shadow tip (420,182)
  const pBase=[80,182], pTop=[80,112], pShad=[134,182];
  const bBase=[328,182], bTop=[328,42], bShad=[420,182];

  return `<svg viewBox="0 0 440 210" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- ground line -->
    <line x1="10" y1="182" x2="430" y2="182" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- person -->
    <line x1="${pBase[0]}" y1="${pBase[1]}" x2="${pTop[0]}" y2="${pTop[1]}" stroke="${S.col}" stroke-width="2.5"/>
    <circle cx="${pTop[0]}" cy="${R(pTop[1]-6)}" r="7" fill="none" stroke="${S.col}" stroke-width="2"/>
    <!-- person shadow -->
    <line x1="${pBase[0]}" y1="184" x2="${pShad[0]}" y2="184" stroke="${S.col}" stroke-width="3" opacity="0.3"/>
    <!-- sun ray -->
    <line x1="${pTop[0]}" y1="${R(pTop[1]-13)}" x2="${pShad[0]}" y2="${pShad[1]}" stroke="${S.col}" stroke-width="1.2" stroke-dasharray="5,4"/>
    <!-- right angle at person base -->
    ${sq(...pBase,...pTop,...pShad, 8)}
    <!-- building -->
    <rect x="290" y="${bTop[1]}" width="38" height="${bBase[1]-bTop[1]}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" rx="1"/>
    <!-- building shadow -->
    <line x1="${bBase[0]}" y1="184" x2="${bShad[0]}" y2="184" stroke="${S.col}" stroke-width="3" opacity="0.3"/>
    <!-- sun ray -->
    <line x1="${bBase[0]}" y1="${bTop[1]}" x2="${bShad[0]}" y2="${bShad[1]}" stroke="${S.col}" stroke-width="1.2" stroke-dasharray="5,4"/>
    <!-- right angle at building base -->
    ${sq(...bBase,...bTop,...bShad, 8)}
    <!-- labels -->
    ${txt(60, 150, '1.7 מ׳')}
    ${txt(107, 197, '2 מ׳')}
    ${txt(274, 115, '? מ׳', {bold:true})}
    ${txt(374, 197, '12 מ׳')}
  </svg>`;
}

/* ── Q5: Hourglass / butterfly ─────────────────────── */
function diagramHourglass() {
  // AB = wider bottom, CD = narrower top (so CP > AP matches the problem)
  const A=[80,195], B=[240,195], C=[40,30], D=[280,30];
  // Intersection P of lines AD and BC (computed):
  // Line AD: (80+200t, 195-165t)  Line BC: (240-200s, 195-165s)
  // t = s = 0.4  →  P = (160, 129)
  const P=[160,129];

  const cUp  = cen(...C,...D,...P);   // upper triangle centroid
  const cDn  = cen(...A,...B,...P);   // lower triangle centroid

  return `<svg viewBox="0 0 320 225" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- crossing lines -->
    <line x1="${A[0]}" y1="${A[1]}" x2="${D[0]}" y2="${D[1]}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <line x1="${B[0]}" y1="${B[1]}" x2="${C[0]}" y2="${C[1]}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- bases AB and CD -->
    <line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <line x1="${C[0]}" y1="${C[1]}" x2="${D[0]}" y2="${D[1]}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- angle arcs: ∠A = ∠C (single), ∠B = ∠D (double) -->
    ${arc(...A,...B,...P, 20)}
    ${arc(...C,...D,...P, 20)}
    ${arc2(...B,...A,...P, 18)}
    ${arc2(...D,...C,...P, 18)}
    <!-- vertically opposite angles at P -->
    ${arc(...P,...A,...B, 12)}
    ${arc(...P,...C,...D, 12)}
    <!-- vertices -->
    ${dot(...A)}${lbl(...A,...cDn,'A', 20)}
    ${dot(...B)}${lbl(...B,...cDn,'B', 20)}
    ${dot(...C)}${lbl(...C,...cUp,'C', 20)}
    ${dot(...D)}${lbl(...D,...cUp,'D', 20)}
    ${dot(...P)}<text x="${R(P[0]+12)}" y="${R(P[1]-6)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">P</text>
    <!-- measurements -->
    ${seg(...A,...P,'AP = 4', -16)}
    ${seg(...B,...P,'BP = 3', 16)}
    ${seg(...C,...P,'CP = 6', 16)}
    ${seg(...D,...P,'DP = ?', -16, true)}
  </svg>`;
}

/* ── Q6: Midsegment PQ ∥ BC ───────────────────────── */
function diagramMidsegment() {
  const A=[180,18], B=[30,220], C=[330,220];
  const P = [(A[0]+B[0])/2, (A[1]+B[1])/2];   // midpoint AB = (105,119)
  const Q = [(A[0]+C[0])/2, (A[1]+C[1])/2];   // midpoint AC = (255,119)
  const c1 = cen(...A,...B,...C);

  return `<svg viewBox="0 0 360 245" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- triangle -->
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <!-- midsegment PQ -->
    <line x1="${R(P[0])}" y1="${R(P[1])}" x2="${R(Q[0])}" y2="${R(Q[1])}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- tick marks: AP = PB (1 tick each) -->
    ${tick(...A,...P, 1, 7)}
    ${tick(...P,...B, 1, 7)}
    <!-- tick marks: AQ = QC (1 tick each) -->
    ${tick(...A,...Q, 1, 7)}
    ${tick(...Q,...C, 1, 7)}
    <!-- parallel marks on PQ and BC -->
    ${tick(...P,...Q, 2, 5)}
    ${tick(...B,...C, 2, 5)}
    <!-- vertices -->
    ${dot(...A)}${lbl(...A,...c1,'A')}
    ${dot(...B)}${lbl(...B,...c1,'B')}
    ${dot(...C)}${lbl(...C,...c1,'C')}
    ${dot(...P)}<text x="${R(P[0]-16)}" y="${R(P[1]-2)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">P</text>
    ${dot(...Q)}<text x="${R(Q[0]+16)}" y="${R(Q[1]-2)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">Q</text>
    <!-- measurements -->
    ${txt((B[0]+C[0])/2, 240, 'BC = 18')}
    ${txt((P[0]+Q[0])/2, P[1]-10, 'PQ = ?', {bold:true})}
  </svg>`;
}

/* ── Q12: DE ∥ BC, find BC ─────────────────────────── */
function diagramParallelCalc() {
  const A=[180,18], B=[40,240], C=[320,240];
  // D on AB at 1/3, E on AC at 1/3
  const t = 1/3;
  const D=[A[0]+t*(B[0]-A[0]), A[1]+t*(B[1]-A[1])];  // ≈(133.3, 92)
  const E=[A[0]+t*(C[0]-A[0]), A[1]+t*(C[1]-A[1])];  // ≈(226.7, 92)
  const c1 = cen(...A,...B,...C);

  return `<svg viewBox="0 0 360 260" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- triangle -->
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <!-- DE segment -->
    <line x1="${R(D[0])}" y1="${R(D[1])}" x2="${R(E[0])}" y2="${R(E[1])}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- parallel marks -->
    ${tick(...D,...E, 2, 5)}
    ${tick(...B,...C, 2, 5)}
    <!-- shared angle at A -->
    ${arc(...A,...B,...C, 22)}
    <!-- vertices -->
    ${dot(...A)}${lbl(...A,...c1,'A')}
    ${dot(...B)}${lbl(...B,...c1,'B')}
    ${dot(...C)}${lbl(...C,...c1,'C')}
    ${dot(...D)}<text x="${R(D[0]-16)}" y="${R(D[1]-2)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">D</text>
    ${dot(...E)}<text x="${R(E[0]+16)}" y="${R(E[1]-2)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">E</text>
    <!-- measurements -->
    ${seg(...A,...D,'AD = 5', -18)}
    ${seg(...A,...B,'AB = 15', -28)}
    ${txt((D[0]+E[0])/2, D[1]-12, 'DE = 7')}
    ${txt((B[0]+C[0])/2, 258, 'BC = ?', {bold:true})}
  </svg>`;
}

/* ── Q14: Trapezoid area (DE ∥ BC, AD:DB = 2:3) ──── */
function diagramTrapezoidArea() {
  const A=[180,18], B=[40,260], C=[320,260];
  // D on AB at 2/5, E on AC at 2/5
  const t = 2/5;
  const D=[A[0]+t*(B[0]-A[0]), A[1]+t*(B[1]-A[1])]; // (124, 114.8)
  const E=[A[0]+t*(C[0]-A[0]), A[1]+t*(C[1]-A[1])]; // (236, 114.8)
  const c1 = cen(...A,...B,...C);

  return `<svg viewBox="0 0 360 285" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- outer triangle -->
    <polygon points="${A} ${B} ${C}" fill="none" stroke="${S.col}" stroke-width="${S.lw}" stroke-linejoin="round"/>
    <!-- inner triangle ADE (subtle fill) -->
    <polygon points="${A} ${R(D[0])},${R(D[1])} ${R(E[0])},${R(E[1])}" fill="rgba(0,0,0,0.04)" stroke="none"/>
    <!-- DE segment -->
    <line x1="${R(D[0])}" y1="${R(D[1])}" x2="${R(E[0])}" y2="${R(E[1])}" stroke="${S.col}" stroke-width="${S.lw}"/>
    <!-- parallel marks -->
    ${tick(...D,...E, 2, 5)}
    ${tick(...B,...C, 2, 5)}
    <!-- vertices -->
    ${dot(...A)}${lbl(...A,...c1,'A')}
    ${dot(...B)}${lbl(...B,...c1,'B')}
    ${dot(...C)}${lbl(...C,...c1,'C')}
    ${dot(...D)}<text x="${R(D[0]-16)}" y="${R(D[1]-2)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">D</text>
    ${dot(...E)}<text x="${R(E[0]+16)}" y="${R(E[1]-2)}" font-size="${S.fs}" font-weight="bold" fill="${S.col}" font-family="${S.f}">E</text>
    <!-- ratio labels on AB -->
    ${seg(...A,...D,'2', -14)}
    ${seg(...D,...B,'3', -14)}
    <!-- area labels -->
    ${txt(180, 75, 'S = 16', {bold:true})}
    ${txt(180, 205, 'שטח טרפז = ?', {bold:true})}
  </svg>`;
}

/* map diagram keys → functions */
const DIAGRAMS = {
  twoTriangles:    diagramTwoTriangles,
  parallelLine:    diagramParallelLine,
  rightTriangleAlt:diagramRightTriangleAlt,
  shadow:          diagramShadow,
  hourglass:       diagramHourglass,
  midsegment:      diagramMidsegment,
  parallelCalc:    diagramParallelCalc,
  trapezoidArea:   diagramTrapezoidArea
};

/* ══════════════════════════════════════════════════════
   Questions — 15 שאלות מורכבות (8 עם שרטוטים)
   ══════════════════════════════════════════════════════ */

const baseQuestions = [
  /* ── Q1: שני משולשים דומים — מציאת צלע ── */
  {
    id: 'q1',
    prompt: 'בשרטוט, \\(\\triangle ABC \\sim \\triangle DEF\\). נתון: \\(\\angle A=\\angle D\\), \\(\\angle B=\\angle E\\), \\(AB=12\\), \\(DE=8\\), \\(BC=15\\).<br>מצאו את \\(EF\\).',
    diagram: 'twoTriangles',
    options: ['10', '12', '20', '7.5'],
    correct: '10',
    explanation: 'יחס הדמיון: \\(\\frac{AB}{DE}=\\frac{12}{8}=\\frac{3}{2}\\). לכן \\(\\frac{BC}{EF}=\\frac{3}{2}\\) ⇒ \\(EF=\\frac{15 \\cdot 2}{3}=10\\).'
  },

  /* ── Q2: קו מקביל — מציאת קטע ── */
  {
    id: 'q2',
    prompt: 'בשרטוט, \\(DE \\parallel BC\\). נתון: \\(AD=6\\), \\(DB=4\\), \\(AE=9\\).<br>מצאו את \\(EC\\).',
    diagram: 'parallelLine',
    options: ['6', '8', '4', '5'],
    correct: '6',
    explanation: 'קו מקביל חותך צלעות ביחס שווה: \\(\\frac{AD}{DB}=\\frac{AE}{EC}\\) ⇒ \\(\\frac{6}{4}=\\frac{9}{EC}\\) ⇒ \\(EC=6\\).'
  },

  /* ── Q3: משולש ישר-זווית עם גובה ליתר — מציאת BH ── */
  {
    id: 'q3',
    prompt: 'במשולש ישר-זווית \\(ABC\\) כך ש-\\(\\angle B=90°\\), הורד גובה \\(BH\\) ליתר \\(AC\\).<br>נתון: \\(AH=9\\), \\(HC=16\\). מצאו את \\(BH\\).',
    diagram: 'rightTriangleAlt',
    options: ['12', '10', '15', '144'],
    correct: '12',
    explanation: 'בגובה ליתר: \\(BH^2 = AH \\cdot HC = 9 \\cdot 16 = 144\\) ⇒ \\(BH=12\\).<br>(ממוצע גיאומטרי: \\(\\triangle ABH \\sim \\triangle BCH\\)).'
  },

  /* ── Q4: בעיית צל (יישום מעשי) ── */
  {
    id: 'q4',
    prompt: 'אדם בגובה \\(1.7\\) מ׳ מטיל צל באורך \\(2\\) מ׳. בניין סמוך מטיל צל באורך \\(12\\) מ׳ באותו רגע.<br>מהו גובה הבניין?',
    diagram: 'shadow',
    options: ['10.2 מ׳', '8.5 מ׳', '14.1 מ׳', '6 מ׳'],
    correct: '10.2 מ׳',
    explanation: 'משולשי הצל דומים (ז.ז — זוויות השמש זהות).<br>\\(\\frac{1.7}{2}=\\frac{x}{12} \\Rightarrow x=\\frac{1.7 \\cdot 12}{2}=10.2\\) מ׳.'
  },

  /* ── Q5: שעון חול / פרפר — זוויות קודקודיות ── */
  {
    id: 'q5',
    prompt: 'בשרטוט, הישרים \\(AD\\) ו-\\(BC\\) נחתכים ב-\\(P\\). \\(\\angle APB=\\angle CPD\\) (קודקודיות) ו-\\(\\angle A=\\angle C\\).<br>נתון: \\(AP=4\\), \\(CP=6\\), \\(BP=3\\). מצאו את \\(DP\\).',
    diagram: 'hourglass',
    options: ['4.5', '5', '2', '8'],
    correct: '4.5',
    explanation: '\\(\\triangle APB \\sim \\triangle CPD\\) (ז.ז).<br>\\(\\frac{AP}{CP}=\\frac{BP}{DP}\\) ⇒ \\(\\frac{4}{6}=\\frac{3}{DP}\\) ⇒ \\(DP=4.5\\).'
  },

  /* ── Q6: קטע אמצעים ── */
  {
    id: 'q6',
    prompt: 'בשרטוט, \\(P\\) ו-\\(Q\\) אמצעי הצלעות \\(AB\\) ו-\\(AC\\) בהתאמה. נתון: \\(BC=18\\).<br>מהו אורך \\(PQ\\)?',
    diagram: 'midsegment',
    options: ['9', '12', '6', '18'],
    correct: '9',
    explanation: 'קטע אמצעים מקביל לצלע השלישית ושווה לחציה: \\(PQ=\\frac{BC}{2}=\\frac{18}{2}=9\\).<br>(\\(\\triangle APQ \\sim \\triangle ABC\\) עם \\(k=\\frac{1}{2}\\)).'
  },

  /* ── Q7: זיהוי קריטריון דמיון ── */
  {
    id: 'q7',
    prompt: 'נתון: \\(\\frac{AB}{DE}=\\frac{BC}{EF}=\\frac{AC}{DF}=2\\).<br>לפי איזה קריטריון המשולשים דומים?',
    options: ['צ.צ.צ — שלוש צלעות פרופורציונליות', 'ז.ז — שתי זוויות שוות', 'צ.ז.צ — שתי צלעות וזווית ביניהן', 'אי אפשר לקבוע'],
    correct: 'צ.צ.צ — שלוש צלעות פרופורציונליות',
    explanation: 'כאשר כל שלוש הצלעות פרופורציונליות ביחס קבוע, הדמיון הוא לפי קריטריון <strong>צ.צ.צ</strong>.'
  },

  /* ── Q8: יחס שטחים מיחס דמיון ── */
  {
    id: 'q8',
    prompt: 'יחס הדמיון בין שני משולשים הוא \\(3{:}5\\). מהו יחס השטחים?',
    options: ['\\(9{:}25\\)', '\\(3{:}5\\)', '\\(6{:}10\\)', '\\(27{:}125\\)'],
    correct: '\\(9{:}25\\)',
    explanation: 'יחס שטחים = ריבוע יחס הדמיון: \\(k^2=\\left(\\frac{3}{5}\\right)^2=\\frac{9}{25}\\).'
  },

  /* ── Q9: יחס שטחים ← יחס היקפים ── */
  {
    id: 'q9',
    prompt: 'יחס השטחים בין שני משולשים דומים הוא \\(49{:}16\\). מהו יחס ההיקפים?',
    options: ['\\(7{:}4\\)', '\\(49{:}16\\)', '\\(14{:}8\\)', '\\(2401{:}256\\)'],
    correct: '\\(7{:}4\\)',
    explanation: 'יחס דמיון \\(= \\sqrt{\\frac{49}{16}}=\\frac{7}{4}\\).<br>יחס ההיקפים = יחס הדמיון = \\(7{:}4\\).'
  },

  /* ── Q10: חישוב היקף ── */
  {
    id: 'q10',
    prompt: 'היקף \\(\\triangle ABC\\) הוא \\(36\\) ס״מ. \\(\\triangle ABC \\sim \\triangle DEF\\) עם יחס דמיון \\(3{:}2\\)&ensp;(ABC גדול).<br>מהו היקף \\(\\triangle DEF\\)?',
    options: ['24 ס״מ', '54 ס״מ', '18 ס״מ', '12 ס״מ'],
    correct: '24 ס״מ',
    explanation: 'יחס היקפים = יחס הדמיון.<br>\\(P_{DEF}=36 \\cdot \\frac{2}{3}=24\\) ס״מ.'
  },

  /* ── Q11: מידע לא מספיק ── */
  {
    id: 'q11',
    prompt: 'איזה מידע <strong>אינו מספיק לבדו</strong> להוכחת דמיון משולשים?',
    options: ['זווית אחת שווה בלבד', 'שתי זוויות שוות (ז.ז)', 'שלוש צלעות פרופורציונליות (צ.צ.צ)', 'שתי צלעות פרופורציונליות + זווית ביניהן שווה (צ.ז.צ)'],
    correct: 'זווית אחת שווה בלבד',
    explanation: 'זווית אחת בלבד אינה מספיקה — ייתכנו משולשים שונים לגמרי עם זווית זהה.<br>נדרש לפחות ז.ז, צ.ז.צ, או צ.צ.צ.'
  },

  /* ── Q12: DE ∥ BC — מציאת BC ── */
  {
    id: 'q12',
    prompt: 'בשרטוט, \\(DE \\parallel BC\\). נתון: \\(AD=5\\), \\(AB=15\\), \\(DE=7\\).<br>מצאו את \\(BC\\).',
    diagram: 'parallelCalc',
    options: ['21', '15', '35', '10.5'],
    correct: '21',
    explanation: '\\(\\triangle ADE \\sim \\triangle ABC\\).<br>\\(\\frac{AD}{AB}=\\frac{DE}{BC}\\) ⇒ \\(\\frac{5}{15}=\\frac{7}{BC}\\) ⇒ \\(BC=21\\).'
  },

  /* ── Q13: שטח משולש גדול ── */
  {
    id: 'q13',
    prompt: '\\(\\triangle ABC \\sim \\triangle DEF\\), יחס דמיון \\(k=\\frac{1}{3}\\)&ensp;(ABC קטן יותר).<br>אם \\(S_{\\triangle ABC}=8\\), מצאו את \\(S_{\\triangle DEF}\\).',
    options: ['72', '24', '64', '48'],
    correct: '72',
    explanation: 'יחס שטחים \\(= k^2 = \\frac{1}{9}\\).<br>\\(\\frac{S_{ABC}}{S_{DEF}}=\\frac{1}{9}\\) ⇒ \\(S_{DEF}=8 \\cdot 9=72\\).'
  },

  /* ── Q14: שטח טרפז ── */
  {
    id: 'q14',
    prompt: 'בשרטוט, \\(DE \\parallel BC\\). נתון: \\(AD{:}DB=2{:}3\\). שטח \\(\\triangle ADE=16\\).<br>מצאו את שטח הטרפז \\(BCED\\).',
    diagram: 'trapezoidArea',
    options: ['84', '64', '100', '144'],
    correct: '84',
    explanation: '\\(AD{:}AB=2{:}5\\). יחס שטחים \\(=\\left(\\frac{2}{5}\\right)^2=\\frac{4}{25}\\).<br>\\(S_{\\triangle ABC}=16 \\cdot \\frac{25}{4}=100\\).<br>שטח הטרפז \\(=100-16=84\\).'
  },

  /* ── Q15: משולש ישר-זווית — מציאת AB ── */
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

const quizContainer   = document.getElementById('quiz-container');
const submitBtn       = document.getElementById('btn-submit');
const retryBtn        = document.getElementById('btn-retry');
const sendBtn         = document.getElementById('btn-send');
const resultsBox      = document.getElementById('results');
const scoreLine       = document.getElementById('score-line');
const wrongList       = document.getElementById('wrong-list');
const studentNameInput = document.getElementById('student-name');
const nameError       = document.getElementById('name-error');

/* Fisher-Yates shuffle */
function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/* ── Build quiz ────────────────────────── */
function buildQuiz() {
  questions = baseQuestions.map(q => ({ ...q, options: shuffle(q.options) }));
  quizContainer.innerHTML = '';

  questions.forEach((q, idx) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `card-${q.id}`;

    /* radio options */
    let optionsHtml = '';
    q.options.forEach((opt, optIdx) => {
      const radioId = `r-${q.id}-${optIdx}`;
      optionsHtml += `
        <label class="option" for="${radioId}">
          <input type="radio" id="${radioId}" name="${q.id}" value="${opt}">
          <span>${opt}</span>
        </label>`;
    });

    /* optional diagram */
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

  /* render MathJax in new content */
  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    MathJax.typesetPromise([quizContainer]);
  }
}

/* ── Check answers ─────────────────────── */
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

  /* re-render MathJax in explanations */
  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    MathJax.typesetPromise();
  }

  /* confetti for 90+ */
  if (score >= 90) { launchConfetti(); }
}

/* ── Send to Google Sheets ─────────────── */
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

/* ── Retry ─────────────────────────────── */
function retryHomework() {
  resultsBox.classList.add('hidden');
  scoreLine.textContent = '';
  wrongList.innerHTML   = '';
  lastCheckData = null;
  buildQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Simple confetti 🎉 ───────────────── */
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

/* ── Event listeners ───────────────────── */
submitBtn.addEventListener('click', checkAnswers);
retryBtn.addEventListener('click', retryHomework);
sendBtn.addEventListener('click', sendToGoogleSheets);
studentNameInput.addEventListener('input', () => { nameError.style.display = 'none'; });

/* ── Init ──────────────────────────────── */
buildQuiz();
