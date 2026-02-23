// =============================================================
// מטלת דמיון משולשים — גרסה מורחבת עם שרטוטים ושאלות מורכבות
// =============================================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7piOmLUYOo6AwkpragXdu2eyQiXmULIF4Dn9gticn_A4EO5v07Y5onA3Padas0zCB2w/exec';
const SHEET_NAME = 'דמיון משולשים';

/* ══════════════════════════════════════════════════════
   SVG Diagram Functions — שרטוטי משולשים בסגנון ספר לימוד
   Shared constants for the clean "textbook" look
   ══════════════════════════════════════════════════════ */

const D = {                       // shared diagram token palette
  lw: '1.8',                      // line-width
  col: '#222',                    // line / label colour
  dot: 3.2,                       // vertex-dot radius
  font: 'Arial, Heebo, sans-serif',
  sz: '16',                       // label font-size
  msz: '13',                      // measurement font-size
};

function vtx(x, y, label, anchor) {
  const a = anchor || 'middle';
  return `<circle cx="${x}" cy="${y}" r="${D.dot}" fill="${D.col}"/>
    <text x="${x}" y="${y}" dy="-8" font-size="${D.sz}" font-weight="bold" fill="${D.col}" text-anchor="${a}" font-family="${D.font}">${label}</text>`;
}

/* ── Q1 : Two separate similar triangles ────────────── */
function diagramTwoTriangles() {
  return `<svg viewBox="0 0 480 210" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC (large) -->
    <polygon points="20,185 120,30 220,185" fill="none" stroke="${D.col}" stroke-width="${D.lw}" stroke-linejoin="round"/>
    <!-- vertices -->
    ${vtx(20,185,'A','end')}
    ${vtx(120,30,'B','middle')}
    ${vtx(220,185,'C','start')}
    <!-- side labels -->
    <text x="55" y="115" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">12</text>
    <text x="185" y="115" font-size="${D.msz}" fill="${D.col}" font-family="${D.font}">15</text>
    <!-- ~ -->
    <text x="258" y="118" font-size="28" fill="#999" font-family="serif">~</text>
    <!-- △DEF (small) -->
    <polygon points="295,185 370,68 445,185" fill="none" stroke="${D.col}" stroke-width="${D.lw}" stroke-linejoin="round"/>
    ${vtx(295,185,'D','end')}
    ${vtx(370,68,'E','middle')}
    ${vtx(445,185,'F','start')}
    <text x="322" y="135" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">8</text>
    <text x="420" y="135" font-size="15" fill="${D.col}" font-weight="bold" font-family="${D.font}">?</text>
  </svg>`;
}

/* ── Q2 : Parallel line inside triangle (DE ∥ BC) ──── */
function diagramParallelLine() {
  // A(180,18)  B(30,225)  C(330,225)
  // D on AB at ~60%, E on AC at ~60%  →  D(90,143)  E(270,143)
  return `<svg viewBox="0 0 360 250" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- outer triangle -->
    <polygon points="180,18 30,225 330,225" fill="none" stroke="${D.col}" stroke-width="${D.lw}" stroke-linejoin="round"/>
    <!-- DE segment -->
    <line x1="90" y1="143" x2="270" y2="143" stroke="${D.col}" stroke-width="${D.lw}"/>
    <!-- parallel tick-marks (//) on DE -->
    <line x1="176" y1="137" x2="180" y2="149" stroke="${D.col}" stroke-width="1.6"/>
    <line x1="183" y1="137" x2="187" y2="149" stroke="${D.col}" stroke-width="1.6"/>
    <!-- parallel tick-marks (//) on BC -->
    <line x1="176" y1="219" x2="180" y2="231" stroke="${D.col}" stroke-width="1.6"/>
    <line x1="183" y1="219" x2="187" y2="231" stroke="${D.col}" stroke-width="1.6"/>
    <!-- vertices -->
    ${vtx(180,18,'A','middle')}
    ${vtx(30,225,'B','end')}
    ${vtx(330,225,'C','start')}
    <circle cx="90" cy="143" r="${D.dot}" fill="${D.col}"/>
    <text x="74" y="140" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">D</text>
    <circle cx="270" cy="143" r="${D.dot}" fill="${D.col}"/>
    <text x="282" y="140" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">E</text>
    <!-- measurements -->
    <text x="120" y="74" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">AD = 6</text>
    <text x="48" y="192" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">DB = 4</text>
    <text x="248" y="74" font-size="${D.msz}" fill="${D.col}" font-family="${D.font}">AE = 9</text>
    <text x="310" y="192" font-size="${D.msz}" fill="${D.col}" font-weight="bold" font-family="${D.font}">EC = ?</text>
  </svg>`;
}

/* ── Q3 / Q15 : Right triangle + altitude to hypotenuse ── */
function diagramRightTriangleAlt() {
  // A(50,190) B(155,45) C(330,190) H(155,190)
  return `<svg viewBox="0 0 400 230" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- triangle -->
    <polygon points="50,190 155,45 330,190" fill="none" stroke="${D.col}" stroke-width="${D.lw}" stroke-linejoin="round"/>
    <!-- altitude BH -->
    <line x1="155" y1="45" x2="155" y2="190" stroke="${D.col}" stroke-width="1.4" stroke-dasharray="6,4"/>
    <!-- right-angle at B -->
    <polyline points="143,58 150,68 160,61" fill="none" stroke="${D.col}" stroke-width="1.3"/>
    <!-- right-angle at H -->
    <polyline points="155,176 169,176 169,190" fill="none" stroke="${D.col}" stroke-width="1.3"/>
    <!-- vertices -->
    ${vtx(50,190,'A','end')}
    ${vtx(155,45,'B','middle')}
    ${vtx(330,190,'C','start')}
    <circle cx="155" cy="190" r="${D.dot}" fill="${D.col}"/>
    <text x="163" y="208" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">H</text>
    <!-- measurements -->
    <text x="102" y="220" font-size="${D.msz}" fill="${D.col}" text-anchor="middle" font-family="${D.font}">AH = 9</text>
    <text x="242" y="220" font-size="${D.msz}" fill="${D.col}" text-anchor="middle" font-family="${D.font}">HC = 16</text>
  </svg>`;
}

/* ── Q4 : Shadow problem ──────────────────────────────── */
function diagramShadow() {
  return `<svg viewBox="0 0 440 210" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- ground -->
    <line x1="10" y1="182" x2="430" y2="182" stroke="${D.col}" stroke-width="${D.lw}"/>
    <!-- person (stick) -->
    <line x1="80" y1="182" x2="80" y2="112" stroke="${D.col}" stroke-width="2.5"/>
    <circle cx="80" cy="106" r="7" fill="none" stroke="${D.col}" stroke-width="2"/>
    <!-- person shadow on ground -->
    <line x1="80" y1="184" x2="134" y2="184" stroke="${D.col}" stroke-width="3" opacity="0.35"/>
    <!-- sun ray (person) -->
    <line x1="80" y1="99" x2="134" y2="182" stroke="${D.col}" stroke-width="1.2" stroke-dasharray="5,4"/>
    <!-- building -->
    <rect x="290" y="42" width="38" height="140" fill="none" stroke="${D.col}" stroke-width="${D.lw}" rx="1"/>
    <!-- building shadow on ground -->
    <line x1="328" y1="184" x2="420" y2="184" stroke="${D.col}" stroke-width="3" opacity="0.35"/>
    <!-- sun ray (building) -->
    <line x1="328" y1="42" x2="420" y2="182" stroke="${D.col}" stroke-width="1.2" stroke-dasharray="5,4"/>
    <!-- height / shadow length labels -->
    <text x="62" y="152" font-size="12" fill="${D.col}" text-anchor="end" font-family="${D.font}">1.7 מ׳</text>
    <text x="107" y="198" font-size="12" fill="${D.col}" text-anchor="middle" font-family="${D.font}">2 מ׳</text>
    <text x="280" y="115" font-size="14" fill="${D.col}" font-weight="bold" text-anchor="end" font-family="${D.font}">? מ׳</text>
    <text x="374" y="198" font-size="12" fill="${D.col}" text-anchor="middle" font-family="${D.font}">12 מ׳</text>
  </svg>`;
}

/* ── Q5 : Hourglass / butterfly (like image 1) ──────── */
function diagramHourglass() {
  // Matches the reference image style exactly:
  // Upper triangle  C──D  with P at crossing, lower triangle A──B
  // Lines AP-C and BP-D cross at P
  //   A(60,210) B(260,210) — bottom
  //   C(100,20) D(220,20) — top
  //   P(160,115) — intersection
  return `<svg viewBox="0 0 320 240" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- full crossing lines -->
    <line x1="60" y1="210" x2="220" y2="20" stroke="${D.col}" stroke-width="${D.lw}"/>
    <line x1="260" y1="210" x2="100" y2="20" stroke="${D.col}" stroke-width="${D.lw}"/>
    <!-- bottom base AB -->
    <line x1="60" y1="210" x2="260" y2="210" stroke="${D.col}" stroke-width="${D.lw}"/>
    <!-- top base CD -->
    <line x1="100" y1="20" x2="220" y2="20" stroke="${D.col}" stroke-width="${D.lw}"/>
    <!-- vertices -->
    ${vtx(60,210,'A','end')}
    ${vtx(260,210,'B','start')}
    ${vtx(100,20,'C','end')}
    ${vtx(220,20,'D','start')}
    <circle cx="160" cy="115" r="${D.dot}" fill="${D.col}"/>
    <text x="170" y="110" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">P</text>
    <!-- measurements along diagonals -->
    <text x="100" y="168" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">AP = 4</text>
    <text x="222" y="168" font-size="${D.msz}" fill="${D.col}" font-family="${D.font}">BP = 3</text>
    <text x="122" y="62" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">CP = 6</text>
    <text x="200" y="62" font-size="${D.msz}" fill="${D.col}" font-weight="bold" font-family="${D.font}">DP = ?</text>
  </svg>`;
}

/* ── Q6 : Midsegment (like image 2) ──────────────────── */
function diagramMidsegment() {
  // Matches the reference image style:
  //   A top, B bottom-left, C bottom-right
  //   P midpoint of AB, Q midpoint of AC
  //   PQ ∥ BC (horizontal line)
  return `<svg viewBox="0 0 360 240" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- triangle ABC -->
    <polygon points="180,18 30,220 330,220" fill="none" stroke="${D.col}" stroke-width="${D.lw}" stroke-linejoin="round"/>
    <!-- midsegment PQ -->
    <line x1="105" y1="119" x2="255" y2="119" stroke="${D.col}" stroke-width="${D.lw}"/>
    <!-- tick marks: AP = PB single -->
    <line x1="140" y1="61" x2="147" y2="76" stroke="${D.col}" stroke-width="1.8"/>
    <line x1="63" y1="163" x2="70" y2="178" stroke="${D.col}" stroke-width="1.8"/>
    <!-- tick marks: AQ = QC single -->
    <line x1="220" y1="61" x2="213" y2="76" stroke="${D.col}" stroke-width="1.8"/>
    <line x1="297" y1="163" x2="290" y2="178" stroke="${D.col}" stroke-width="1.8"/>
    <!-- vertices -->
    ${vtx(180,18,'A','middle')}
    ${vtx(30,220,'B','end')}
    ${vtx(330,220,'C','start')}
    <circle cx="105" cy="119" r="${D.dot}" fill="${D.col}"/>
    <text x="88" y="116" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">P</text>
    <circle cx="255" cy="119" r="${D.dot}" fill="${D.col}"/>
    <text x="266" y="116" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">Q</text>
    <!-- measurements -->
    <text x="180" y="240" font-size="${D.msz}" fill="${D.col}" text-anchor="middle" font-family="${D.font}">BC = 18</text>
    <text x="180" y="112" font-size="${D.msz}" fill="${D.col}" font-weight="bold" text-anchor="middle" font-family="${D.font}">PQ = ?</text>
  </svg>`;
}

/* ── Q12 : Parallel line — finding BC ─────────────────── */
function diagramParallelCalc() {
  // A(180,18) B(40,240) C(320,240), D at 1/3, E at 1/3
  return `<svg viewBox="0 0 360 260" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- triangle -->
    <polygon points="180,18 40,240 320,240" fill="none" stroke="${D.col}" stroke-width="${D.lw}" stroke-linejoin="round"/>
    <!-- DE segment -->
    <line x1="133" y1="92" x2="227" y2="92" stroke="${D.col}" stroke-width="${D.lw}"/>
    <!-- parallel marks DE -->
    <line x1="176" y1="86" x2="180" y2="98" stroke="${D.col}" stroke-width="1.6"/>
    <line x1="183" y1="86" x2="187" y2="98" stroke="${D.col}" stroke-width="1.6"/>
    <!-- parallel marks BC -->
    <line x1="176" y1="234" x2="180" y2="246" stroke="${D.col}" stroke-width="1.6"/>
    <line x1="183" y1="234" x2="187" y2="246" stroke="${D.col}" stroke-width="1.6"/>
    <!-- vertices -->
    ${vtx(180,18,'A','middle')}
    ${vtx(40,240,'B','end')}
    ${vtx(320,240,'C','start')}
    <circle cx="133" cy="92" r="${D.dot}" fill="${D.col}"/>
    <text x="117" y="89" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">D</text>
    <circle cx="227" cy="92" r="${D.dot}" fill="${D.col}"/>
    <text x="238" y="89" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">E</text>
    <!-- measurements -->
    <text x="142" y="48" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">AD = 5</text>
    <text x="80" y="158" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">AB = 15</text>
    <text x="180" y="83" font-size="${D.msz}" fill="${D.col}" text-anchor="middle" font-family="${D.font}">DE = 7</text>
    <text x="180" y="258" font-size="${D.msz}" fill="${D.col}" font-weight="bold" text-anchor="middle" font-family="${D.font}">BC = ?</text>
  </svg>`;
}

/* ── Q14 : Trapezoid area problem ─────────────────────── */
function diagramTrapezoidArea() {
  // A(180,18) B(40,260) C(320,260), D/E at 2/5
  return `<svg viewBox="0 0 360 285" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- outer triangle -->
    <polygon points="180,18 40,260 320,260" fill="none" stroke="${D.col}" stroke-width="${D.lw}" stroke-linejoin="round"/>
    <!-- inner triangle ADE (light fill for area emphasis) -->
    <polygon points="180,18 124,115 236,115" fill="rgba(0,0,0,0.04)" stroke="none"/>
    <!-- DE segment -->
    <line x1="124" y1="115" x2="236" y2="115" stroke="${D.col}" stroke-width="${D.lw}"/>
    <!-- vertices -->
    ${vtx(180,18,'A','middle')}
    ${vtx(40,260,'B','end')}
    ${vtx(320,260,'C','start')}
    <circle cx="124" cy="115" r="${D.dot}" fill="${D.col}"/>
    <text x="108" y="112" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">D</text>
    <circle cx="236" cy="115" r="${D.dot}" fill="${D.col}"/>
    <text x="248" y="112" font-size="${D.sz}" font-weight="bold" fill="${D.col}" font-family="${D.font}">E</text>
    <!-- ratio marks on AB: AD = 2 parts, DB = 3 parts -->
    <text x="138" y="58" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">2</text>
    <text x="68" y="196" font-size="${D.msz}" fill="${D.col}" text-anchor="end" font-family="${D.font}">3</text>
    <!-- area labels -->
    <text x="180" y="80" font-size="14" fill="${D.col}" font-weight="bold" text-anchor="middle" font-family="${D.font}">S = 16</text>
    <text x="180" y="206" font-size="14" fill="${D.col}" font-weight="bold" text-anchor="middle" font-family="${D.font}">שטח טרפז = ?</text>
  </svg>`;
}

/* map diagram keys → functions */
const DIAGRAMS = {
  twoTriangles: diagramTwoTriangles,
  parallelLine: diagramParallelLine,
  rightTriangleAlt: diagramRightTriangleAlt,
  shadow: diagramShadow,
  hourglass: diagramHourglass,
  midsegment: diagramMidsegment,
  parallelCalc: diagramParallelCalc,
  trapezoidArea: diagramTrapezoidArea
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
