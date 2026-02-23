// =============================================================
// מטלת דמיון משולשים — גרסה מורחבת עם שרטוטים ושאלות מורכבות
// =============================================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7piOmLUYOo6AwkpragXdu2eyQiXmULIF4Dn9gticn_A4EO5v07Y5onA3Padas0zCB2w/exec';
const SHEET_NAME = 'דמיון משולשים';

/* ══════════════════════════════════════════════════════
   SVG Diagram Functions — שרטוטי משולשים
   ══════════════════════════════════════════════════════ */

function diagramTwoTriangles() {
  return `<svg viewBox="0 0 480 220" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC — large -->
    <polygon points="20,190 110,30 200,190" fill="rgba(37,99,235,0.07)" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- angle arcs A, B -->
    <path d="M 36,178 A 20 20 0 0 1 28,162" fill="none" stroke="#e11d48" stroke-width="2"/>
    <path d="M 102,50 A 17 17 0 0 1 118,50" fill="none" stroke="#e11d48" stroke-width="2"/>
    <!-- vertex labels -->
    <text x="8" y="208" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">A</text>
    <text x="104" y="22" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">B</text>
    <text x="204" y="208" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">C</text>
    <!-- side labels -->
    <text x="48" y="116" font-size="14" fill="#1e3a5f" text-anchor="end" font-family="Heebo,sans-serif" font-weight="600">12</text>
    <text x="172" y="116" font-size="14" fill="#1e3a5f" font-family="Heebo,sans-serif" font-weight="600">15</text>
    <!-- ~ symbol -->
    <text x="235" y="118" font-size="26" fill="#9ca3af" font-family="serif">~</text>
    <!-- △DEF — small -->
    <polygon points="270,190 340,75 410,190" fill="rgba(220,38,38,0.07)" stroke="#dc2626" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- angle arcs D, E -->
    <path d="M 283,179 A 16 16 0 0 1 277,166" fill="none" stroke="#e11d48" stroke-width="2"/>
    <path d="M 334,92 A 14 14 0 0 1 347,92" fill="none" stroke="#e11d48" stroke-width="2"/>
    <!-- vertex labels -->
    <text x="258" y="208" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">D</text>
    <text x="334" y="67" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">E</text>
    <text x="414" y="208" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">F</text>
    <!-- side labels -->
    <text x="293" y="140" font-size="14" fill="#1e3a5f" text-anchor="end" font-family="Heebo,sans-serif" font-weight="600">8</text>
    <text x="388" y="140" font-size="15" fill="#dc2626" font-weight="bold" font-family="Heebo,sans-serif">?</text>
  </svg>`;
}

function diagramParallelLine() {
  return `<svg viewBox="0 0 360 250" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC -->
    <polygon points="180,20 30,225 330,225" fill="rgba(37,99,235,0.07)" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- DE ∥ BC (dashed) -->
    <line x1="90" y1="143" x2="270" y2="143" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="7,4"/>
    <!-- parallel marks on DE -->
    <line x1="176" y1="137" x2="180" y2="149" stroke="#e11d48" stroke-width="2"/>
    <line x1="183" y1="137" x2="187" y2="149" stroke="#e11d48" stroke-width="2"/>
    <!-- parallel marks on BC -->
    <line x1="176" y1="219" x2="180" y2="231" stroke="#e11d48" stroke-width="2"/>
    <line x1="183" y1="219" x2="187" y2="231" stroke="#e11d48" stroke-width="2"/>
    <!-- labels -->
    <text x="180" y="14" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle" font-family="Heebo,sans-serif">A</text>
    <text x="16" y="242" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">B</text>
    <text x="334" y="242" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">C</text>
    <text x="74" y="140" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">D</text>
    <text x="276" y="140" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">E</text>
    <!-- measurements -->
    <text x="118" y="76" font-size="13" fill="#333" text-anchor="end" font-family="Heebo,sans-serif">AD = 6</text>
    <text x="46" y="192" font-size="13" fill="#333" text-anchor="end" font-family="Heebo,sans-serif">DB = 4</text>
    <text x="248" y="76" font-size="13" fill="#333" font-family="Heebo,sans-serif">AE = 9</text>
    <text x="316" y="192" font-size="14" fill="#dc2626" font-weight="bold" font-family="Heebo,sans-serif">EC = ?</text>
  </svg>`;
}

function diagramRightTriangleAlt() {
  // △ABC right angle at B, altitude BH to hypotenuse AC
  // A(50,190) B(151,56) C(330,190) H(151,190)
  return `<svg viewBox="0 0 400 240" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC -->
    <polygon points="50,190 151,56 330,190" fill="rgba(37,99,235,0.07)" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- altitude BH (dashed) -->
    <line x1="151" y1="56" x2="151" y2="190" stroke="#dc2626" stroke-width="2" stroke-dasharray="6,4"/>
    <!-- right-angle mark at H -->
    <polyline points="151,176 165,176 165,190" fill="none" stroke="#555" stroke-width="1.5"/>
    <!-- right-angle mark at B (approx) -->
    <path d="M 141,68 L 149,75 L 156,67" fill="none" stroke="#555" stroke-width="1.5"/>
    <!-- vertex labels -->
    <text x="35" y="208" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">A</text>
    <text x="144" y="46" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle" font-family="Heebo,sans-serif">B</text>
    <text x="340" y="208" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">C</text>
    <text x="159" y="208" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">H</text>
    <!-- measurements -->
    <text x="100" y="228" font-size="14" fill="#333" text-anchor="middle" font-family="Heebo,sans-serif">AH = 9</text>
    <text x="240" y="228" font-size="14" fill="#333" text-anchor="middle" font-family="Heebo,sans-serif">HC = 16</text>
  </svg>`;
}

function diagramShadow() {
  return `<svg viewBox="0 0 440 210" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- sun -->
    <circle cx="16" cy="22" r="14" fill="#fbbf24" opacity="0.8"/>
    <text x="16" y="27" font-size="14" text-anchor="middle" font-family="sans-serif">☀</text>
    <!-- ground -->
    <line x1="10" y1="180" x2="430" y2="180" stroke="#94a3b8" stroke-width="2"/>
    <text x="430" y="195" font-size="11" fill="#94a3b8" text-anchor="end" font-family="Heebo,sans-serif">קרקע</text>
    <!-- person stick figure -->
    <line x1="80" y1="180" x2="80" y2="112" stroke="#2563eb" stroke-width="3"/>
    <circle cx="80" cy="104" r="8" fill="none" stroke="#2563eb" stroke-width="2.5"/>
    <!-- person shadow -->
    <line x1="80" y1="181" x2="130" y2="181" stroke="#fbbf24" stroke-width="5" opacity="0.55"/>
    <!-- sun ray (person) -->
    <line x1="80" y1="96" x2="130" y2="180" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <!-- building -->
    <rect x="290" y="42" width="40" height="138" fill="rgba(37,99,235,0.1)" stroke="#2563eb" stroke-width="2.5" rx="2"/>
    <!-- building shadow -->
    <line x1="330" y1="181" x2="420" y2="181" stroke="#fbbf24" stroke-width="5" opacity="0.55"/>
    <!-- sun ray (building) -->
    <line x1="330" y1="42" x2="420" y2="180" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4,3"/>
    <!-- labels -->
    <text x="62" y="150" font-size="12" fill="#333" text-anchor="end" font-family="Heebo,sans-serif">1.7 מ׳</text>
    <text x="105" y="198" font-size="12" fill="#333" text-anchor="middle" font-family="Heebo,sans-serif">2 מ׳</text>
    <text x="280" y="115" font-size="13" fill="#dc2626" font-weight="bold" text-anchor="end" font-family="Heebo,sans-serif">? מ׳</text>
    <text x="375" y="198" font-size="12" fill="#333" text-anchor="middle" font-family="Heebo,sans-serif">12 מ׳</text>
  </svg>`;
}

function diagramHourglass() {
  // Two crossing lines through E forming butterfly / hourglass
  // Line 1: A(60,30) → E(160,120) → C(260,210)
  // Line 2: B(260,30) → E(160,120) → D(60,210)
  return `<svg viewBox="0 0 320 240" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- guide lines (light) -->
    <line x1="60" y1="30" x2="260" y2="210" stroke="#d1d5db" stroke-width="1" stroke-dasharray="3,3"/>
    <line x1="260" y1="30" x2="60" y2="210" stroke="#d1d5db" stroke-width="1" stroke-dasharray="3,3"/>
    <!-- upper △AEB -->
    <polygon points="60,30 260,30 160,120" fill="rgba(37,99,235,0.07)" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- lower △CED -->
    <polygon points="60,210 260,210 160,120" fill="rgba(220,38,38,0.07)" stroke="#dc2626" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- vertex E dot -->
    <circle cx="160" cy="120" r="4" fill="#111"/>
    <!-- vertex labels -->
    <text x="48" y="25" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">A</text>
    <text x="264" y="25" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">B</text>
    <text x="168" y="117" font-size="16" font-weight="bold" fill="#111" font-family="Heebo,sans-serif">E</text>
    <text x="42" y="228" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">C</text>
    <text x="264" y="228" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">D</text>
    <!-- measurements -->
    <text x="94" y="72" font-size="13" fill="#333" text-anchor="end" font-family="Heebo,sans-serif">AE = 4</text>
    <text x="228" y="72" font-size="13" fill="#333" font-family="Heebo,sans-serif">BE = 3</text>
    <text x="94" y="178" font-size="13" fill="#333" text-anchor="end" font-family="Heebo,sans-serif">CE = 6</text>
    <text x="228" y="178" font-size="14" fill="#dc2626" font-weight="bold" font-family="Heebo,sans-serif">DE = ?</text>
  </svg>`;
}

function diagramMidsegment() {
  return `<svg viewBox="0 0 360 240" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC -->
    <polygon points="180,20 30,210 330,210" fill="rgba(37,99,235,0.07)" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- midsegment DE -->
    <line x1="105" y1="115" x2="255" y2="115" stroke="#dc2626" stroke-width="2.5"/>
    <!-- midpoint dots -->
    <circle cx="105" cy="115" r="4" fill="#dc2626"/>
    <circle cx="255" cy="115" r="4" fill="#dc2626"/>
    <!-- tick marks AD = DB -->
    <line x1="139" y1="60" x2="147" y2="74" stroke="#e11d48" stroke-width="2.5"/>
    <line x1="62" y1="157" x2="70" y2="171" stroke="#e11d48" stroke-width="2.5"/>
    <!-- tick marks AE = EC -->
    <line x1="221" y1="60" x2="213" y2="74" stroke="#e11d48" stroke-width="2.5"/>
    <line x1="298" y1="157" x2="290" y2="171" stroke="#e11d48" stroke-width="2.5"/>
    <!-- labels -->
    <text x="180" y="14" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle" font-family="Heebo,sans-serif">A</text>
    <text x="16" y="226" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">B</text>
    <text x="334" y="226" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">C</text>
    <text x="88" y="112" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">D</text>
    <text x="262" y="112" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">E</text>
    <!-- measurements -->
    <text x="180" y="232" font-size="14" fill="#333" text-anchor="middle" font-family="Heebo,sans-serif">BC = 18</text>
    <text x="180" y="108" font-size="14" fill="#dc2626" font-weight="bold" text-anchor="middle" font-family="Heebo,sans-serif">DE = ?</text>
  </svg>`;
}

function diagramParallelCalc() {
  // DE ∥ BC, AD=5, AB=15 → ratio 1/3
  // A(180,20) B(40,235) C(320,235), D at 1/3, E at 1/3
  return `<svg viewBox="0 0 360 260" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC -->
    <polygon points="180,20 40,240 320,240" fill="rgba(37,99,235,0.07)" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- DE ∥ BC (dashed) -->
    <line x1="133" y1="93" x2="227" y2="93" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="7,4"/>
    <!-- parallel marks -->
    <line x1="176" y1="87" x2="180" y2="99" stroke="#e11d48" stroke-width="2"/>
    <line x1="183" y1="87" x2="187" y2="99" stroke="#e11d48" stroke-width="2"/>
    <line x1="176" y1="234" x2="180" y2="246" stroke="#e11d48" stroke-width="2"/>
    <line x1="183" y1="234" x2="187" y2="246" stroke="#e11d48" stroke-width="2"/>
    <!-- labels -->
    <text x="180" y="14" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle" font-family="Heebo,sans-serif">A</text>
    <text x="26" y="256" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">B</text>
    <text x="324" y="256" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">C</text>
    <text x="117" y="90" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">D</text>
    <text x="233" y="90" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">E</text>
    <!-- measurements -->
    <text x="142" y="50" font-size="13" fill="#333" text-anchor="end" font-family="Heebo,sans-serif">AD = 5</text>
    <text x="88" y="155" font-size="13" fill="#333" text-anchor="end" font-family="Heebo,sans-serif">AB = 15</text>
    <text x="180" y="84" font-size="13" fill="#333" text-anchor="middle" font-family="Heebo,sans-serif">DE = 7</text>
    <text x="180" y="258" font-size="14" fill="#dc2626" font-weight="bold" text-anchor="middle" font-family="Heebo,sans-serif">BC = ?</text>
  </svg>`;
}

function diagramTrapezoidArea() {
  // DE ∥ BC, AD:DB = 2:3, area △ADE = 16
  // A(180,20) B(40,255) C(320,255), D at 2/5 from A, E at 2/5
  return `<svg viewBox="0 0 360 285" class="diagram-svg" xmlns="http://www.w3.org/2000/svg">
    <!-- △ABC full -->
    <polygon points="180,20 40,260 320,260" fill="rgba(37,99,235,0.05)" stroke="#2563eb" stroke-width="2.5" stroke-linejoin="round"/>
    <!-- △ADE shaded -->
    <polygon points="180,20 124,116 236,116" fill="rgba(220,38,38,0.15)" stroke="#dc2626" stroke-width="2" stroke-linejoin="round"/>
    <!-- DE line -->
    <line x1="124" y1="116" x2="236" y2="116" stroke="#dc2626" stroke-width="2" stroke-dasharray="7,4"/>
    <!-- labels -->
    <text x="180" y="14" font-size="16" font-weight="bold" fill="#2563eb" text-anchor="middle" font-family="Heebo,sans-serif">A</text>
    <text x="26" y="275" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">B</text>
    <text x="324" y="275" font-size="16" font-weight="bold" fill="#2563eb" font-family="Heebo,sans-serif">C</text>
    <text x="106" y="113" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">D</text>
    <text x="242" y="113" font-size="16" font-weight="bold" fill="#dc2626" font-family="Heebo,sans-serif">E</text>
    <!-- ratio labels on side AB -->
    <text x="139" y="60" font-size="14" fill="#333" text-anchor="end" font-family="Heebo,sans-serif" font-weight="600">2</text>
    <text x="68" y="196" font-size="14" fill="#333" text-anchor="end" font-family="Heebo,sans-serif" font-weight="600">3</text>
    <!-- area labels -->
    <text x="180" y="82" font-size="15" fill="#dc2626" font-weight="bold" text-anchor="middle" font-family="Heebo,sans-serif">S = 16</text>
    <text x="180" y="205" font-size="15" fill="#2563eb" font-weight="bold" text-anchor="middle" font-family="Heebo,sans-serif">שטח טרפז = ?</text>
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
    prompt: 'בשרטוט, הישרים \\(AC\\) ו-\\(BD\\) נחתכים ב-\\(E\\). \\(\\angle AEB=\\angle CED\\) (קודקודיות) ו-\\(\\angle A=\\angle C\\).<br>נתון: \\(AE=4\\), \\(CE=6\\), \\(BE=3\\). מצאו את \\(DE\\).',
    diagram: 'hourglass',
    options: ['4.5', '5', '2', '8'],
    correct: '4.5',
    explanation: '\\(\\triangle AEB \\sim \\triangle CED\\) (ז.ז).<br>\\(\\frac{AE}{CE}=\\frac{BE}{DE}\\) ⇒ \\(\\frac{4}{6}=\\frac{3}{DE}\\) ⇒ \\(DE=4.5\\).'
  },

  /* ── Q6: קטע אמצעים ── */
  {
    id: 'q6',
    prompt: 'בשרטוט, \\(D\\) ו-\\(E\\) אמצעי הצלעות \\(AB\\) ו-\\(AC\\) בהתאמה. נתון: \\(BC=18\\).<br>מהו אורך \\(DE\\)?',
    diagram: 'midsegment',
    options: ['9', '12', '6', '18'],
    correct: '9',
    explanation: 'קטע אמצעים מקביל לצלע השלישית ושווה לחציה: \\(DE=\\frac{BC}{2}=\\frac{18}{2}=9\\).<br>(\\(\\triangle ADE \\sim \\triangle ABC\\) עם \\(k=\\frac{1}{2}\\)).'
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
