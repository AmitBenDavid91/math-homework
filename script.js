// =====================================================================
//  שיעורי בית — נגזרת מורכבת, מכפלה, גורם משותף
//  script.js — גרסה משופרת עם משוב מיידי, רמזים, ניקוד חלקי ועוד
// =====================================================================

const DEFAULT_GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

function getGoogleScriptUrl() {
  try {
    const saved = localStorage.getItem('google_script_url');
    return (saved && saved.trim()) || DEFAULT_GOOGLE_SCRIPT_URL;
  } catch (e) {
    return DEFAULT_GOOGLE_SCRIPT_URL;
  }
}

function saveGoogleScriptUrl() {
  const input = document.getElementById('google-script-url');
  const status = document.getElementById('google-script-status');
  if (!input || !status) return;

  const url = input.value.trim();
  if (!url) {
    status.textContent = '⚠️ הדביקו URL תקין של Web App.';
    status.className = 'config-status error';
    return;
  }

  try {
    localStorage.setItem('google_script_url', url);
    status.textContent = '✅ נשמר בהצלחה בדפדפן הזה.';
    status.className = 'config-status success';
  } catch (e) {
    status.textContent = '❌ לא ניתן לשמור בדפדפן. נסו שוב.';
    status.className = 'config-status error';
  }
}

// =====================================================================
//  פונקציות עזר
// =====================================================================

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function makeOptions(correct, distractors) {
  const opts = shuffleArray([correct, ...distractors]);
  return { options: ['\u05D1\u05D7\u05E8/\u05D9...', ...opts], correct };
}
function makeRadioOptions(correct, distractors) {
  const opts = shuffleArray([correct, ...distractors]);
  return { options: opts, correct };
}

// ---------- LaTeX formatting helpers ----------

function fmtLinear(a, b) {
  let s = '';
  if (a === 1) s = 'x';
  else if (a === -1) s = '-x';
  else s = a + 'x';
  if (b > 0) s += '+' + b;
  else if (b < 0) s += b;
  return s;
}

function fmtQuadNoConst(a, b) {
  let s = '';
  if (a === 1) s = 'x^2';
  else if (a === -1) s = '-x^2';
  else s = a + 'x^2';
  if (b === 1) s += '+x';
  else if (b === -1) s += '-x';
  else if (b > 0) s += '+' + b + 'x';
  else if (b < 0) s += b + 'x';
  return s;
}

function fmtCoeff(c, varName, isFirst) {
  if (c === 0) return '';
  let s = '';
  if (isFirst) {
    if (c === 1) s = varName;
    else if (c === -1) s = '-' + varName;
    else s = c + varName;
  } else {
    if (c === 1) s = '+' + varName;
    else if (c === -1) s = '-' + varName;
    else if (c > 0) s = '+' + c + varName;
    else s = c + varName;
  }
  return s;
}

function tex(s) { return '\\(' + s + '\\)'; }

// =====================================================================
//  חלק א: נגזרת מורכבת (שאלות 1–4)
// =====================================================================

function genQ1() {
  const a = randChoice([2, 3, 4, 5, 6, 7]);
  const b = randChoice([-5, -4, -3, -2, -1, 1, 2, 3, 4, 5]);
  const n = randInt(4, 8);
  const inner = fmtLinear(a, b);
  const deriv = n * a;

  return {
    id: 'q1', section: 'a',
    title: tex(`y=(${inner})^{${n}}`),
    titlePrefix: 'גזרו את הפונקציה',
    type: 'guided', weight: 5,
    hint: 'זהו את הפנימית (מה שבתוך הסוגריים) ואת החיצונית (החזקה). גזרו כל אחת בנפרד וכפלו.',
    steps: [
      {
        text: 'מדובר בפונקציה',
        fieldId: 'q1_s1',
        ...makeOptions('מורכבת', ['פשוטה', 'מכפלה']),
        scoring: false,
        explanation: 'יש כאן ביטוי בתוך סוגריים מורם בחזקה — זו פונקציה מורכבת (פנימית בתוך חיצונית).'
      },
      {
        text: 'הפונקציה החיצונית היא',
        fieldId: 'q1_s2',
        ...makeOptions(tex(`u^{${n}}`), [tex(`u^{${n - 1}}`), tex(`${n}u`)]),
        scoring: false,
        explanation: `החיצונית היא הפעולה שעושים על u — כאן מעלים בחזקת ${n}, כלומר u^${n}.`
      },
      {
        text: 'הפונקציה הפנימית היא ' + tex(`u=`),
        fieldId: 'q1_s3',
        ...makeOptions(tex(inner), [tex(fmtLinear(a, 0)), tex(fmtLinear(a + 1, b))]),
        scoring: false,
        explanation: 'הפנימית היא מה שבתוך הסוגריים — הביטוי שמציבים במקום u.'
      },
      {
        text: 'נגזרת החיצונית (לפי ' + tex('u') + ') היא',
        fieldId: 'q1_s4',
        ...makeOptions(
          tex(`${n}u^{${n - 1}}`),
          [tex(`${n - 1}u^{${n}}`), tex(`${n}u^{${n - 2}}`)]
        ),
        scoring: false,
        explanation: `נגזרת של u^${n} היא ${n}u^${n - 1} — מורידים את החזקה ומפחיתים 1.`
      },
      {
        text: 'נגזרת הפנימית: ' + tex(`u'=(${inner})'=`),
        fieldId: 'q1_s5',
        ...makeOptions(tex(`${a}`), [tex(`${b}`), tex(`${a}x`), tex(`1`)]),
        scoring: false,
        explanation: `הנגזרת של ${inner} היא ${a} — נגזרת של ax+b היא a.`
      },
      {
        text: 'נכפול חיצונית × פנימית: ' + tex(`y'=`),
        fieldId: 'q1_final',
        ...makeOptions(
          tex(`${deriv}(${inner})^{${n - 1}}`),
          [
            tex(`${n}(${inner})^{${n - 1}}`),
            tex(`${deriv}(${inner})^{${n - 2}}`),
            tex(`${deriv + randChoice([-3, 3, 5])}(${inner})^{${n - 1}}`)
          ]
        ),
        scoring: true,
        explanation: `${n} × ${a} = ${deriv}, והחזקה יורדת ב-1 ל-${n - 1}.`
      }
    ]
  };
}

function genQ2() {
  const bVal = randChoice([2, 3, 4, 5]);
  const c = randInt(2, 9);
  const n = randInt(3, 7);
  const inner = `${c}-${bVal}x`;
  const deriv = n * (-bVal);

  return {
    id: 'q2', section: 'a',
    title: tex(`y=(${inner})^{${n}}`),
    titlePrefix: 'גזרו את הפונקציה',
    type: 'guided', weight: 5,
    hint: 'שימו לב שנגזרת הפנימית היא שלילית! אל תשכחו את הסימן.',
    steps: [
      {
        text: 'מדובר בפונקציה',
        fieldId: 'q2_s1',
        ...makeOptions('מורכבת', ['פשוטה', 'מכפלה']),
        scoring: false,
        explanation: 'יש ביטוי בתוך סוגריים בחזקה — פונקציה מורכבת.'
      },
      {
        text: 'הפונקציה הפנימית היא ' + tex('u='),
        fieldId: 'q2_s2',
        ...makeOptions(tex(inner), [tex(`-${bVal}x`), tex(`${c}x-${bVal}`)]),
        scoring: false,
        explanation: 'הפנימית היא הביטוי השלם בתוך הסוגריים, כולל המספר החופשי.'
      },
      {
        text: 'נגזרת החיצונית (לפי ' + tex('u') + ') היא',
        fieldId: 'q2_s3',
        ...makeOptions(
          tex(`${n}u^{${n - 1}}`),
          [tex(`${n - 1}u^{${n}}`), tex(`${n}u^{${n - 2}}`)]
        ),
        scoring: false,
        explanation: `נגזרת של u^${n} היא ${n}u^${n-1}.`
      },
      {
        text: 'נגזרת הפנימית: ' + tex(`u'=(${inner})'=`),
        fieldId: 'q2_s4',
        ...makeOptions(tex(`${-bVal}`), [tex(`${c}`), tex(`${bVal}`), tex(`-${bVal}x`)]),
        scoring: false,
        explanation: `נגזרת של ${c}-${bVal}x היא -${bVal}. שימו לב לסימן השלילי!`
      },
      {
        text: 'נכפול: ' + tex(`y'=`),
        fieldId: 'q2_final',
        ...makeOptions(
          tex(`${deriv}(${inner})^{${n - 1}}`),
          [
            tex(`${-deriv}(${inner})^{${n - 1}}`),
            tex(`${deriv}(${inner})^{${n - 2}}`),
            tex(`${n}(${inner})^{${n - 1}}`)
          ]
        ),
        scoring: true,
        explanation: `${n} × (${-bVal}) = ${deriv}. הסימן השלילי נובע מנגזרת הפנימית.`
      }
    ]
  };
}

function genQ3() {
  const a = randInt(2, 9);
  const n = randInt(5, 10);

  return {
    id: 'q3', section: 'a',
    title: tex(`y=(-x+${a})^{${n}}`),
    titlePrefix: 'גזרו את הפונקציה',
    type: 'radio', weight: 5,
    hint: 'הפנימית היא -x+' + a + ' ונגזרתה היא -1. אל תשכחו לכפול ב-(-1)!',
    prompt: 'בחרו את הנגזרת הנכונה:',
    explanation: `נגזרת הפנימית (-x+${a}) היא -1, לכן y' = ${n}·(-x+${a})^${n-1}·(-1) = -${n}(-x+${a})^${n-1}.`,
    ...makeRadioOptions(
      tex(`y'=-${n}(-x+${a})^{${n - 1}}`),
      [
        tex(`y'=${n}(-x+${a})^{${n - 1}}`),
        tex(`y'=-${n}(-x+${a})^{${n - 2}}`),
        tex(`y'=-${n - 1}(-x+${a})^{${n}}`)
      ]
    )
  };
}

function genQ4() {
  const b = randChoice([1, 2, 3, 4]);
  const a = b + 1;
  const n = randChoice([5, 6, 7, 8, 10]);
  const innerStr = fmtQuadNoConst(a, b);
  const innerDerivClean = fmtLinear(2 * a, b);
  const innerAtNeg1 = 1;
  const innerDerivAtNeg1 = -2 * a + b;
  const result = n * innerDerivAtNeg1;

  return {
    id: 'q4', section: 'a',
    title: tex(`f(x)=(${innerStr})^{${n}}`),
    titlePrefix: 'נתונה',
    titleSuffix: '. חשבו את ' + tex(`f'(-1)`) + '.',
    type: 'guided', weight: 5,
    hint: 'קודם מצאו את הנגזרת הכללית, ואז הציבו x=-1 בכל מקום.',
    steps: [
      {
        text: 'הפונקציה הפנימית היא ' + tex(`u=${innerStr}`) + ', נגזרת הפנימית: ' + tex(`u'=`),
        fieldId: 'q4_s1',
        ...makeOptions(
          tex(`${innerDerivClean}`),
          [tex(`${fmtLinear(a, b)}`), tex(`${2 * a}x`), tex(`${a}x^2`)]
        ),
        scoring: false,
        explanation: `נגזרת של ${innerStr} — גוזרים כל איבר: ${a}x² → ${2*a}x, ו-${b}x → ${b}.`
      },
      {
        text: 'הנגזרת הכללית: ' + tex(`f'(x)=${n}(${innerStr})^{${n - 1}}\\cdot(${innerDerivClean})`),
        fieldId: 'q4_s1b',
        ...makeOptions('הבנתי ✓', []),
        scoring: false,
        explanation: 'זהו כלל השרשרת: נגזרת החיצונית כפול נגזרת הפנימית.'
      },
      {
        text: 'נציב ' + tex('x=-1') + ' בפנימית: ' + tex(`u(-1)=`),
        fieldId: 'q4_s2',
        ...makeOptions(
          tex(`${innerAtNeg1}`),
          [tex(`${-innerAtNeg1}`), tex(`${innerAtNeg1 + 2}`), tex('0')]
        ),
        scoring: false,
        explanation: `מציבים x=-1: ${a}·(-1)²+${b}·(-1) = ${a}-${b} = ${innerAtNeg1}.`
      },
      {
        text: 'נציב ' + tex('x=-1') + ' בנגזרת הפנימית: ' + tex(`u'(-1)=`),
        fieldId: 'q4_s3',
        ...makeOptions(
          tex(`${innerDerivAtNeg1}`),
          [tex(`${-innerDerivAtNeg1}`), tex(`${innerDerivAtNeg1 + 2}`), tex(`${innerDerivAtNeg1 - 1}`)]
        ),
        scoring: false,
        explanation: `מציבים x=-1: ${2*a}·(-1)+${b} = ${-2*a}+${b} = ${innerDerivAtNeg1}.`
      },
      {
        text: tex(`f'(-1)=${n}\\cdot(${innerAtNeg1})^{${n - 1}}\\cdot(${innerDerivAtNeg1})=`),
        fieldId: 'q4_final',
        ...makeOptions(
          tex(`${result}`),
          [tex(`${-result}`), tex(`${result + n}`), tex(`${n}`)]
        ),
        scoring: true,
        explanation: `${n}·${innerAtNeg1}^${n-1}·(${innerDerivAtNeg1}) = ${n}·1·(${innerDerivAtNeg1}) = ${result}.`
      }
    ]
  };
}

// =====================================================================
//  חלק ב: חקירת פונקציה מורכבת (5א–5ג)
// =====================================================================

const q5State = {};

function genQ5a() {
  const c = randChoice([1, 2, 3, 4]);
  const c2 = c * c;
  q5State.c = c;
  q5State.c2 = c2;

  return {
    id: 'q5a', section: 'b',
    title: tex(`f(x)=(x^2-${c2})^2`),
    titlePrefix: 'נתונה',
    titleSuffix: '. מצאו את ' + tex(`f'(x)`) + '.',
    type: 'guided', weight: 10,
    hint: 'זו פונקציה מורכבת: החיצונית היא u² והפנימית היא x²-' + c2 + '. גזרו כל אחת בנפרד.',
    graphExpr: `(x*x-${c2})*(x*x-${c2})`,
    steps: [
      {
        text: 'הפונקציה החיצונית היא',
        fieldId: 'q5a_s0',
        ...makeOptions(tex('u^2'), [tex('2u'), tex('u')]),
        scoring: false,
        explanation: 'הפעולה שנעשית על הביטוי הפנימי היא העלאה בריבוע — u².'
      },
      {
        text: 'הפונקציה הפנימית היא ' + tex(`u=`),
        fieldId: 'q5a_s1',
        ...makeOptions(tex(`x^2-${c2}`), [tex('x^2'), tex(`x-${c}`)]),
        scoring: false,
        explanation: `הפנימית היא כל מה שבתוך הסוגריים: x²-${c2}.`
      },
      {
        text: 'נגזרת החיצונית (לפי ' + tex('u') + '):',
        fieldId: 'q5a_s1b',
        ...makeOptions(tex('2u'), [tex('u^2'), tex('1')]),
        scoring: false,
        explanation: 'נגזרת של u² היא 2u — מורידים חזקה וכופלים.'
      },
      {
        text: 'נגזרת הפנימית: ' + tex(`u'=(x^2-${c2})'=`),
        fieldId: 'q5a_s2',
        ...makeOptions(tex('2x'), [tex('x^2'), tex(`2x-${c2}`), tex('2')]),
        scoring: false,
        explanation: `נגזרת של x²-${c2}: נגזרת x² היא 2x, ונגזרת קבוע (${c2}) היא 0.`
      },
      {
        text: 'נכפול חיצונית × פנימית: ' + tex(`f'(x)=`),
        fieldId: 'q5a_final',
        ...makeOptions(
          tex(`4x(x^2-${c2})`),
          [tex(`2(x^2-${c2})`), tex(`2x(x^2-${c2})^2`), tex(`4x^2(x^2-${c2})`)]
        ),
        scoring: true,
        explanation: `2(x²-${c2})·2x = 4x(x²-${c2}). כופלים: 2·2=4, u·x=x(x²-${c2}).`
      }
    ]
  };
}

function genQ5b() {
  const c = q5State.c;
  const c2 = q5State.c2;
  const c4 = c2 * c2;
  const tp1 = -(c + 1);
  const tp2Label = c > 1 ? '-1' : `-\\tfrac{1}{2}`;
  const tp3Label = c > 1 ? '1' : `\\tfrac{1}{2}`;
  const tp4 = c + 1;

  return {
    id: 'q5b', section: 'b',
    title: tex(`f(x)=(x^2-${c2})^2`),
    titlePrefix: 'מצאו נקודות קיצון של',
    type: 'guided', weight: 10,
    hint: 'פרקו את f\'(x) לגורמים, מצאו איפה f\'=0, ואז בדקו סימן בכל תחום.',
    graphExpr: `(x*x-${c2})*(x*x-${c2})`,
    steps: [
      {
        text: 'שלב 1: נשווה ' + tex(`f'(x)=0`) + '. נפרק ' + tex(`4x(x^2-${c2})=0`) + ':',
        fieldId: 'q5b_s1',
        ...makeOptions(
          tex(`4x(x-${c})(x+${c})=0`),
          [tex(`4x(x-${c2})=0`), tex(`4(x^2-${c2})=0`)]
        ),
        scoring: false,
        explanation: `x²-${c2} = (x-${c})(x+${c}) — זהו הפרש ריבועים!`
      },
      {
        text: 'שלב 2: הפתרונות של ' + tex(`f'(x)=0`) + ' הם',
        fieldId: 'q5b_s2',
        ...makeOptions(
          tex(`x=-${c},\\; x=0,\\; x=${c}`),
          [
            tex('x=0'),
            tex(`x=${c},\\; x=-${c}`),
            tex(`x=0,\\; x=${c2},\\; x=-${c2}`)
          ]
        ),
        scoring: false,
        explanation: `כל גורם מתאפס: x=0, x-${c}=0 → x=${c}, x+${c}=0 → x=-${c}.`
      },
      {
        text: 'שלב 3 — טבלת סימנים: סימן ' + tex(`f'(${tp1})`) + ' (משמאל ל-' + tex(`x=-${c}`) + '):',
        fieldId: 'q5b_s3a',
        ...makeOptions('שלילי ⊖', ['חיובי ⊕']),
        scoring: false,
        explanation: `מציבים x=${tp1}: 4x שלילי, (x-${c}) שלילי, (x+${c}) שלילי — שלילי·שלילי·שלילי = שלילי.`
      },
      {
        text: 'סימן ' + tex(`f'(${tp2Label})`) + ' (בין ' + tex(`x=-${c}`) + ' ל-' + tex('x=0') + '):',
        fieldId: 'q5b_s3b',
        ...makeOptions('חיובי ⊕', ['שלילי ⊖']),
        scoring: false,
        explanation: `בתחום זה 4x שלילי (כי x שלילי), (x+${c}) חיובי, (x-${c}) שלילי — שלילי·חיובי·שלילי = חיובי.`
      },
      {
        text: 'סימן ' + tex(`f'(${tp3Label})`) + ' (בין ' + tex('x=0') + ' ל-' + tex(`x=${c}`) + '):',
        fieldId: 'q5b_s3c',
        ...makeOptions('שלילי ⊖', ['חיובי ⊕']),
        scoring: false,
        explanation: `בתחום זה 4x חיובי (כי x חיובי), (x+${c}) חיובי, (x-${c}) שלילי — חיובי·חיובי·שלילי = שלילי.`
      },
      {
        text: 'סימן ' + tex(`f'(${tp4})`) + ' (מימין ל-' + tex(`x=${c}`) + '):',
        fieldId: 'q5b_s3d',
        ...makeOptions('חיובי ⊕', ['שלילי ⊖']),
        scoring: false,
        explanation: `4x חיובי, (x+${c}) חיובי, (x-${c}) חיובי — חיובי·חיובי·חיובי = חיובי.`
      },
      {
        text: 'שלב 4: ב-' + tex(`x=-${c}`) + ' הנגזרת עוברת מ-⊖ ל-⊕, לכן זו',
        fieldId: 'q5b_s4a',
        ...makeOptions('נקודת מינימום', ['נקודת מקסימום']),
        scoring: false,
        explanation: 'מעבר מ-⊖ (ירידה) ל-⊕ (עלייה) = נקודת מינימום — הפונקציה "יורדת ועולה".'
      },
      {
        text: 'ב-' + tex('x=0') + ' הנגזרת עוברת מ-⊕ ל-⊖, לכן זו',
        fieldId: 'q5b_s4b',
        ...makeOptions('נקודת מקסימום', ['נקודת מינימום']),
        scoring: false,
        explanation: 'מעבר מ-⊕ (עלייה) ל-⊖ (ירידה) = נקודת מקסימום — הפונקציה "עולה ויורדת".'
      },
      {
        text: 'ב-' + tex(`x=${c}`) + ' הנגזרת עוברת מ-⊖ ל-⊕, לכן זו',
        fieldId: 'q5b_s4c',
        ...makeOptions('נקודת מינימום', ['נקודת מקסימום']),
        scoring: false,
        explanation: 'שוב מעבר מ-⊖ ל-⊕ — נקודת מינימום.'
      },
      {
        text: 'שלב 5: נציב בפונקציה. ערכי ' + tex('f') + ' בנקודות הקיצון:',
        fieldId: 'q5b_final',
        ...makeOptions(
          tex(`f(-${c})=0,\\; f(0)=${c4},\\; f(${c})=0`),
          [
            tex(`f(0)=0,\\; f(${c})=${c4},\\; f(-${c})=${c4}`),
            tex(`f(0)=${c2},\\; f(${c})=0,\\; f(-${c})=0`),
            tex(`f(-${c})=${c2},\\; f(0)=${c4},\\; f(${c})=${c2}`)
          ]
        ),
        scoring: true,
        explanation: `f(-${c})=((-${c})²-${c2})²=(${c2}-${c2})²=0, f(0)=(0-${c2})²=${c4}, f(${c})=0.`
      }
    ]
  };
}

function genQ5c() {
  const c = q5State.c;

  return {
    id: 'q5c', section: 'b',
    title: tex(`f(x)=(x^2-${q5State.c2})^2`),
    titlePrefix: 'מצאו תחומי עלייה וירידה של',
    type: 'guided', weight: 10,
    hint: 'הפונקציה עולה איפה שהנגזרת חיובית (⊕) ויורדת איפה שהנגזרת שלילית (⊖).',
    graphExpr: `(x*x-${q5State.c2})*(x*x-${q5State.c2})`,
    steps: [
      {
        text: 'על סמך טבלת הסימנים: ' + tex('f') + ' עולה (' + tex(`f'>0`) + ') כאשר',
        fieldId: 'q5c_s1',
        ...makeOptions(
          tex(`-${c} < x < 0 \\heb{ או } x > ${c}`),
          [
            tex(`x < -${c} \\heb{ או } x > ${c}`),
            tex(`x < -${c} \\heb{ או } 0 < x < ${c}`),
            tex(`0 < x < ${c} \\heb{ או } x > ${c}`)
          ]
        ),
        scoring: false,
        explanation: 'הפונקציה עולה בתחומים בהם הנגזרת חיובית (⊕) — בודקים בטבלת הסימנים.'
      },
      {
        text: tex('f') + ' יורדת (' + tex(`f'<0`) + ') כאשר',
        fieldId: 'q5c_final',
        ...makeOptions(
          tex(`x < -${c} \\heb{ או } 0 < x < ${c}`),
          [
            tex(`-${c} < x < 0 \\heb{ או } x > ${c}`),
            tex(`x < 0 \\heb{ או } x > ${c}`),
            tex(`-${c} < x < ${c}`)
          ]
        ),
        scoring: true,
        explanation: 'הפונקציה יורדת בתחומים בהם הנגזרת שלילית (⊖).'
      }
    ]
  };
}

// =====================================================================
//  חלק ג: נגזרת מכפלה (שאלות 6–9)
// =====================================================================

function genQ6() {
  const a = randChoice([3, 4, 5, 6, 7, 8, 9]);

  return {
    id: 'q6', section: 'c',
    title: tex(`y=x(x+${a})`),
    titlePrefix: 'גזרו לפי כלל המכפלה:',
    type: 'guided', weight: 5,
    hint: 'פרקו ל-f=x ו-g=(x+' + a + '). זכרו: y\' = f\'·g + f·g\'.',
    steps: [
      {
        text: tex('f=x') + ' ולכן ' + tex(`f'=`),
        fieldId: 'q6_s1',
        ...makeOptions(tex('1'), [tex('x'), tex('0')]),
        scoring: false,
        explanation: 'נגזרת של x היא 1 (כי x = x¹, ונגזרת x¹ = 1·x⁰ = 1).'
      },
      {
        text: tex(`g=(x+${a})`) + ' ולכן ' + tex(`g'=`),
        fieldId: 'q6_s2',
        ...makeOptions(tex('1'), [tex(`${a}`), tex('x')]),
        scoring: false,
        explanation: `נגזרת של x+${a} היא 1 (נגזרת x = 1, נגזרת קבוע = 0).`
      },
      {
        text: tex(`y'=f'\\cdot g+f\\cdot g'=`),
        fieldId: 'q6_final',
        ...makeOptions(
          tex(`(x+${a})+x = 2x+${a}`),
          [tex(`x+${a}`), tex(`x(x+${a})`), tex('2x+1')]
        ),
        scoring: true,
        explanation: `1·(x+${a}) + x·1 = x+${a}+x = 2x+${a}.`
      }
    ]
  };
}

function genQ7() {
  const a = randChoice([2, 3, 4, 5]);
  const b = randChoice([-3, -2, -1, 1, 2, 3]);
  const inner = fmtLinear(a, b);
  const c3a = 3 * a;
  const c2b = 2 * b;

  let finalStr = `${c3a}x^2`;
  if (c2b > 0) finalStr += `+${c2b}x`;
  else if (c2b < 0) finalStr += `${c2b}x`;

  return {
    id: 'q7', section: 'c',
    title: tex(`y=x^2(${inner})`),
    titlePrefix: 'גזרו לפי כלל המכפלה:',
    type: 'guided', weight: 5,
    hint: 'f=x² ו-g=(' + inner + '). שימו לב: f\'=2x ולא x².',
    steps: [
      {
        text: tex('f=x^2') + ' ולכן ' + tex(`f'=`),
        fieldId: 'q7_s1',
        ...makeOptions(tex('2x'), [tex('x^2'), tex('2')]),
        scoring: false,
        explanation: 'נגזרת של x² היא 2x — מורידים חזקה וכופלים.'
      },
      {
        text: tex(`g=(${inner})`) + ' ולכן ' + tex(`g'=`),
        fieldId: 'q7_s2',
        ...makeOptions(tex(`${a}`), [tex('1'), tex(`${a}x`)]),
        scoring: false,
        explanation: `נגזרת של ${inner} היא ${a} — מקדם x.`
      },
      {
        text: tex(`y'=f'\\cdot g+f\\cdot g'=`),
        fieldId: 'q7_final',
        ...makeOptions(
          tex(`2x(${inner})+${a}x^2 = ${finalStr}`),
          [
            tex(`2x(${inner})`),
            tex(`${a + 1}x^2${b >= 0 ? '+' : ''}${b}x`),
            tex(`${2 * a}x^2+${b}`)
          ]
        ),
        scoring: true,
        explanation: `2x·(${inner}) + x²·${a} = ${finalStr}. פותחים סוגריים ומחברים.`
      }
    ]
  };
}

function genQ8() {
  const sets = [
    { a: 1, b: 3 }, { a: 2, b: 4 }, { a: 1, b: 5 },
    { a: 3, b: 5 }, { a: 2, b: 6 }, { a: 1, b: 7 }
  ];
  const { a, b } = randChoice(sets);
  const mid = b - a;
  const half = mid / 2;

  return {
    id: 'q8', section: 'c',
    title: tex(`y=(x-${a})^2(x+${b})^2`),
    titlePrefix: 'גזרו את',
    titleSuffix: 'והוציאו גורם משותף.',
    type: 'guided', weight: 5,
    hint: 'כל גורם הוא פונקציה מורכבת! f\'=2(x-' + a + '), g\'=2(x+' + b + '). הוציאו גמ"ר.',
    steps: [
      {
        text: tex(`f=(x-${a})^2`) + ', נגזרת מורכבת! ' + tex(`f'=`),
        fieldId: 'q8_s1',
        ...makeOptions(tex(`2(x-${a})`), [tex(`(x-${a})^2`), tex(`2x-${a}`)]),
        scoring: false,
        explanation: `נגזרת (x-${a})² = 2(x-${a})·1 = 2(x-${a}). לא לשכוח כלל שרשרת!`
      },
      {
        text: tex(`g=(x+${b})^2`) + ', נגזרת מורכבת! ' + tex(`g'=`),
        fieldId: 'q8_s2',
        ...makeOptions(tex(`2(x+${b})`), [tex(`(x+${b})^2`), tex(`2x+${b}`)]),
        scoring: false,
        explanation: `באותו אופן: נגזרת (x+${b})² = 2(x+${b}).`
      },
      {
        text: 'הגורם המשותף המקסימלי הוא',
        fieldId: 'q8_s3',
        ...makeOptions(
          tex(`2(x-${a})(x+${b})`),
          [tex(`(x-${a})(x+${b})`), tex(`2(x-${a})^2(x+${b})^2`)]
        ),
        scoring: false,
        explanation: `בביטוי f'g + fg' = 2(x-${a})(x+${b})² + (x-${a})²·2(x+${b}), הגמ"ר הוא 2(x-${a})(x+${b}).`
      },
      {
        text: 'אחרי הוצאת גורם משותף: ' + tex(`y'=`),
        fieldId: 'q8_final',
        ...makeOptions(
          tex(`4(x-${a})(x+${half})(x+${b})`),
          [
            tex(`2(x-${a})(x+${b})(2x+${mid})`),
            tex(`4(x-${a})(x+${b})`),
            tex(`(x-${a})(x+${b})(4x+${2 * mid})`)
          ]
        ),
        scoring: true,
        explanation: `מוציאים 2(x-${a})(x+${b}) ומקבלים: [(x+${b})+x-${a}] = [2x+${mid}] = 2(x+${half}).`
      }
    ]
  };
}

function genQ9() {
  const sets = [
    { a: 5, b: 4, m: 3, n: 5 },
    { a: 3, b: 2, m: 4, n: 3 },
    { a: 2, b: 5, m: 3, n: 4 },
    { a: 4, b: 3, m: 2, n: 5 },
    { a: 6, b: 1, m: 3, n: 4 }
  ];
  const { a, b, m, n } = randChoice(sets);
  const sumMN = m + n;
  const lastCoeff = m * b - n * a;
  const lastStr = lastCoeff >= 0 ? `${sumMN}x+${lastCoeff}` : `${sumMN}x${lastCoeff}`;

  const wrongCoeff = lastCoeff + randChoice([-4, 4, 6]);
  const wrongStr = wrongCoeff >= 0 ? `${sumMN}x+${wrongCoeff}` : `${sumMN}x${wrongCoeff}`;

  return {
    id: 'q9', section: 'c',
    title: tex(`y=(x-${a})^{${m}}(x+${b})^{${n}}`),
    titlePrefix: 'גזרו את',
    titleSuffix: 'והוציאו גורם משותף מקסימלי.',
    type: 'radio', weight: 5,
    hint: 'גזרו כל גורם (כלל שרשרת!) ואז הוציאו גמ"ר. הגמ"ר הוא החזקה הנמוכה מכל גורם.',
    prompt: 'בחרו את ' + tex(`y'`) + ' הנכון:',
    explanation: `f'=${m}(x-${a})^${m-1}, g'=${n}(x+${b})^${n-1}. הגמ"ר: (x-${a})^${m-1}(x+${b})^${n-1}. מה שנשאר: ${m}(x+${b})+${n}(x-${a}) = ${lastStr}.`,
    ...makeRadioOptions(
      tex(`y'=(x-${a})^{${m - 1}}(x+${b})^{${n - 1}}(${lastStr})`),
      [
        tex(`y'=(x-${a})^{${m - 1}}(x+${b})^{${n - 1}}(${wrongStr})`),
        tex(`y'=${m}(x-${a})^{${m - 1}}(x+${b})^{${n}}+${n}(x-${a})^{${m}}(x+${b})^{${n - 1}}`),
        tex(`y'=(x-${a})^{${m}}(x+${b})^{${n - 1}}(${lastStr})`)
      ]
    )
  };
}

// =====================================================================
//  חלק ד: הוצאת גורם משותף (שאלות 10–13)
// =====================================================================

function genQ10() {
  const validSets = [
    { a: 4, c: 3, sol2: 4 },
    { a: 3, c: 4, sol2: 6 },
    { a: 2, c: 3, sol2: 6 },
    { a: 2, c: 5, sol2: 10 },
    { a: 5, c: 4, sol2: 5 },
    { a: 6, c: 5, sol2: 6 }
  ];
  const { a, c, sol2 } = randChoice(validSets);
  const am1 = a - 1;
  const ac = a * c;

  return {
    id: 'q10', section: 'd',
    title: tex(`${a}(x-${c})^3 - x(x-${c})^2 = 0`),
    titlePrefix: 'פתרו:',
    type: 'guided', weight: 5,
    hint: 'חפשו את הביטוי שמופיע בשני האיברים בחזקה הנמוכה ביותר — זה הגמ"ר.',
    steps: [
      {
        text: 'הגורם המשותף המקסימלי הוא',
        fieldId: 'q10_s1',
        ...makeOptions(
          tex(`(x-${c})^2`),
          [tex(`(x-${c})^3`), tex(`x(x-${c})`), tex(`(x-${c})`)]
        ),
        scoring: false,
        explanation: `(x-${c}) מופיע בחזקת 3 ובחזקת 2 — הגמ"ר הוא החזקה הנמוכה: (x-${c})².`
      },
      {
        text: 'אחרי הוצאת גורם משותף נקבל',
        fieldId: 'q10_s2',
        ...makeOptions(
          tex(`(x-${c})^2(${a}(x-${c})-x)=0`),
          [tex(`(x-${c})^2(${a}-x)=0`), tex(`(x-${c})(${a}(x-${c})^2-x)=0`)]
        ),
        scoring: false,
        explanation: `מחלקים כל איבר ב-(x-${c})²: ${a}(x-${c})³÷(x-${c})²=${a}(x-${c}), ו-x(x-${c})²÷(x-${c})²=x.`
      },
      {
        text: 'נפשט את הסוגריים ונקבל',
        fieldId: 'q10_s3',
        ...makeOptions(
          tex(`(x-${c})^2(${am1}x-${ac})=0`),
          [tex(`(x-${c})^2(${a}x-${ac})=0`), tex(`(x-${c})^2(${am1 + 1}x-${ac})=0`)]
        ),
        scoring: false,
        explanation: `${a}(x-${c})-x = ${a}x-${ac}-x = ${am1}x-${ac}. פותחים ומפשטים.`
      },
      {
        text: 'הפתרונות: ' + tex('x='),
        fieldId: 'q10_final',
        ...makeOptions(
          tex(`x=${c},\\; x=${sol2}`),
          [tex(`x=${c}`), tex(`x=${c},\\; x=${ac}`), tex(`x=${sol2}`)]
        ),
        scoring: true,
        explanation: `(x-${c})²=0 → x=${c}. ${am1}x-${ac}=0 → x=${ac}/${am1}=${sol2}.`
      }
    ]
  };
}

function genQ11() {
  const a = randChoice([2, 4, 6, 8]);
  const halfA = a / 2;

  return {
    id: 'q11', section: 'd',
    title: tex(`x(x+${a})^3 + x^2(x+${a})^2 = 0`),
    titlePrefix: 'פתרו:',
    type: 'guided', weight: 5,
    hint: 'x מופיע בשני האיברים, וגם (x+' + a + '). קחו את החזקה הנמוכה מכל אחד.',
    steps: [
      {
        text: 'הגורם המשותף המקסימלי הוא',
        fieldId: 'q11_s1',
        ...makeOptions(
          tex(`x(x+${a})^2`),
          [tex(`x^2(x+${a})^2`), tex(`(x+${a})^2`), tex(`x(x+${a})^3`)]
        ),
        scoring: false,
        explanation: `x: חזקות 1 ו-2, גמ"ר x¹. (x+${a}): חזקות 3 ו-2, גמ"ר (x+${a})². ביחד: x(x+${a})².`
      },
      {
        text: 'אחרי הוצאת גורם משותף',
        fieldId: 'q11_s2',
        ...makeOptions(
          tex(`x(x+${a})^2((x+${a})+x)=0`),
          [tex(`x(x+${a})^2(x+${a}+x^2)=0`), tex(`x^2(x+${a})^2(1+x)=0`)]
        ),
        scoring: false,
        explanation: `מחלקים כל איבר בגמ"ר: (x+${a})³÷(x+${a})²=(x+${a}), ו-x²÷x=x.`
      },
      {
        text: 'הפתרונות: ' + tex('x='),
        fieldId: 'q11_final',
        ...makeOptions(
          tex(`x=0,\\; x=-${a},\\; x=-${halfA}`),
          [
            tex(`x=0,\\; x=-${a}`),
            tex(`x=-${a},\\; x=-${halfA}`),
            tex(`x=0,\\; x=${a},\\; x=${halfA}`)
          ]
        ),
        scoring: true,
        explanation: `x=0, (x+${a})²=0 → x=-${a}, (x+${a})+x=2x+${a}=0 → x=-${halfA}.`
      }
    ]
  };
}

function genQ12() {
  const sets = [
    { b: 3, d: 7 }, { b: 2, d: 5 }, { b: 3, d: 4 },
    { b: 5, d: 3 }, { b: 4, d: 3 }
  ];
  const { b, d } = randChoice(sets);
  const bm1 = b - 1;

  return {
    id: 'q12', section: 'd',
    title: tex(`x^2(${b}x-${d})^3 - x(${b}x-${d})^4 = 0`),
    titlePrefix: 'פתרו:',
    type: 'radio', weight: 5,
    hint: 'הגמ"ר הוא x('+b+'x-'+d+')³. אחרי הוצאתו נישאר עם: x-('+b+'x-'+d+').',
    prompt: 'בחרו את קבוצת הפתרונות הנכונה:',
    explanation: `גמ"ר: x(${b}x-${d})³. בתוך הסוגריים: x-(${b}x-${d}) = -${bm1}x+${d}. פתרונות: x=0, ${b}x=${d}, ${bm1}x=${d}.`,
    ...makeRadioOptions(
      tex(`x=0,\\; x=\\frac{${d}}{${b}},\\; x=\\frac{${d}}{${bm1}}`),
      [
        tex(`x=0,\\; x=\\frac{${d}}{${b}}`),
        tex(`x=\\frac{${d}}{${b}},\\; x=\\frac{${d}}{${bm1}}`),
        tex(`x=0,\\; x=${d},\\; x=\\frac{${d}}{${b}}`)
      ]
    )
  };
}

function genQ13() {
  const a = randChoice([2, 3, 4, 5, 6, 7]);
  let b;
  do { b = randChoice([2, 3, 4, 5, 6, 7, 8]); } while (b === a);
  const apb = a + b;

  return {
    id: 'q13', section: 'd',
    title: tex(`(x+${a})^3(x-${b})^2 - (x+${a})^2(x-${b})^3 = 0`),
    titlePrefix: 'פתרו:',
    type: 'radio', weight: 5,
    hint: 'הגמ"ר הוא (x+'+a+')²(x-'+b+')². מה נשאר אחרי הוצאתו?',
    prompt: 'בחרו את קבוצת הפתרונות הנכונה:',
    explanation: `גמ"ר: (x+${a})²(x-${b})². בסוגריים: (x+${a})-(x-${b}) = ${apb}. זה קבוע≠0, לכן רק (x+${a})²=0 או (x-${b})²=0.`,
    ...makeRadioOptions(
      tex(`x=-${a},\\; x=${b}`),
      [
        tex(`x=-${a},\\; x=${b},\\; x=\\frac{1}{2}`),
        tex(`x=${b}`),
        tex(`x=-${a},\\; x=${b},\\; x=${apb}`)
      ]
    )
  };
}

// =====================================================================
//  חלק ה: חקירת פונקציה — מכפלה (14א–14ב)
// =====================================================================

const q14State = {};

function genQ14a() {
  const validSets = [
    { p: 1, q: 4 }, { p: 2, q: 5 }, { p: 1, q: 7 },
    { p: 4, q: 7 }, { p: 3, q: 6 }, { p: 2, q: 8 }
  ];
  const { p, q } = randChoice(validSets);
  const r = (2 * p + q) / 3;
  const coeff = 2 * p + q;

  q14State.p = p;
  q14State.q = q;
  q14State.r = r;
  q14State.coeff = coeff;

  return {
    id: 'q14a', section: 'e',
    title: tex(`f(x)=(x-${p})(x-${q})^2`),
    titlePrefix: 'נתונה',
    titleSuffix: '. מצאו את ' + tex(`f'(x)`) + ' והוציאו גורם משותף.',
    type: 'guided', weight: 5,
    hint: 'השתמשו בכלל המכפלה: f=(x-'+p+'), g=(x-'+q+')². אל תשכחו לגזור g בכלל שרשרת!',
    graphExpr: `(x-${p})*(x-${q})*(x-${q})`,
    steps: [
      {
        text: 'כלל המכפלה: ' + tex(`f=(x-${p})`) + ' ולכן ' + tex(`f'=`),
        fieldId: 'q14a_s1',
        ...makeOptions(tex('1'), [tex('-1'), tex('x')]),
        scoring: false,
        explanation: `נגזרת של (x-${p}) היא 1 — נגזרת x = 1, נגזרת קבוע = 0.`
      },
      {
        text: tex(`g=(x-${q})^2`) + ', נגזרת מורכבת! ' + tex(`g'=`),
        fieldId: 'q14a_s2',
        ...makeOptions(tex(`2(x-${q})`), [tex(`(x-${q})^2`), tex(`2x-${q}`)]),
        scoring: false,
        explanation: `נגזרת (x-${q})² = 2(x-${q})·1 — כלל שרשרת כשהנגזרת הפנימית היא 1.`
      },
      {
        text: tex(`y'=f'g+fg' = (x-${q})^2 + 2(x-${p})(x-${q})`),
        fieldId: 'q14a_s2b',
        ...makeOptions('הבנתי ✓', []),
        scoring: false,
        explanation: 'מציבים בנוסחה: 1·(x-'+q+')² + (x-'+p+')·2(x-'+q+').'
      },
      {
        text: 'הגורם המשותף המקסימלי הוא',
        fieldId: 'q14a_s3',
        ...makeOptions(
          tex(`(x-${q})`),
          [tex(`(x-${q})^2`), tex(`(x-${p})(x-${q})`)]
        ),
        scoring: false,
        explanation: `(x-${q}) מופיע בחזקת 2 ובחזקת 1 — הגמ"ר הוא (x-${q})¹.`
      },
      {
        text: 'אחרי הוצאת גורם משותף: ' + tex(`f'(x)=`),
        fieldId: 'q14a_final',
        ...makeOptions(
          tex(`(x-${q})(3x-${coeff})`),
          [
            tex(`(x-${q})(3x-${coeff + 2})`),
            tex(`(x-${q})^2(3x-${coeff})`),
            tex(`2(x-${q})(x-${p})+(x-${q})^2`)
          ]
        ),
        scoring: true,
        explanation: `(x-${q})[(x-${q})+2(x-${p})] = (x-${q})[x-${q}+2x-${2*p}] = (x-${q})(3x-${coeff}).`
      }
    ]
  };
}

function genQ14b() {
  const { p, q, r, coeff } = q14State;

  const tp1 = r - 1;
  const tp2 = Math.floor((r + q) / 2) || r + 1;
  const tp3 = q + 1;

  return {
    id: 'q14b', section: 'e',
    title: tex(`f(x)=(x-${p})(x-${q})^2`),
    titlePrefix: 'מצאו נקודות קיצון ותחומי עלייה/ירידה של',
    type: 'guided', weight: 5,
    hint: 'השוו f\'(x)=0, מצאו נקודות קריטיות, ואז בדקו סימן בכל תחום.',
    graphExpr: `(x-${p})*(x-${q})*(x-${q})`,
    steps: [
      {
        text: 'שלב 1: נשווה ' + tex(`f'(x)=0`) + ': ' + tex(`(x-${q})(3x-${coeff})=0`),
        fieldId: 'q14b_s0',
        ...makeOptions(
          tex(`x=${r},\\; x=${q}`),
          [
            tex(`x=${p},\\; x=${q}`),
            tex(`x=${q}`),
            tex(`x=${r}`)
          ]
        ),
        scoring: false,
        explanation: `(x-${q})=0 → x=${q}. (3x-${coeff})=0 → x=${coeff}/3=${r}.`
      },
      {
        text: 'שלב 2 — טבלת סימנים: סימן ' + tex(`f'(${tp1})`) + ' (משמאל ל-' + tex(`x=${r}`) + '):',
        fieldId: 'q14b_s1a',
        ...makeOptions('חיובי ⊕', ['שלילי ⊖']),
        scoring: false,
        explanation: `מציבים x=${tp1}: שני הגורמים (x-${q}) ו-(3x-${coeff}) שליליים. שלילי·שלילי = חיובי.`
      },
      {
        text: 'סימן ' + tex(`f'(${tp2})`) + ' (בין ' + tex(`x=${r}`) + ' ל-' + tex(`x=${q}`) + '):',
        fieldId: 'q14b_s1b',
        ...makeOptions('שלילי ⊖', ['חיובי ⊕']),
        scoring: false,
        explanation: `מציבים x=${tp2}: (x-${q}) שלילי, (3x-${coeff}) חיובי. שלילי·חיובי = שלילי.`
      },
      {
        text: 'סימן ' + tex(`f'(${tp3})`) + ' (מימין ל-' + tex(`x=${q}`) + '):',
        fieldId: 'q14b_s1c',
        ...makeOptions('חיובי ⊕', ['שלילי ⊖']),
        scoring: false,
        explanation: `מציבים x=${tp3}: שני הגורמים חיוביים. חיובי·חיובי = חיובי.`
      },
      {
        text: 'שלב 3: ב-' + tex(`x=${r}`) + ' הנגזרת עוברת מ-⊕ ל-⊖, לכן זו',
        fieldId: 'q14b_s2a',
        ...makeOptions('נקודת מקסימום', ['נקודת מינימום']),
        scoring: false,
        explanation: '⊕ → ⊖ = עלייה ואז ירידה → נקודת מקסימום (הפונקציה מגיעה לשיא ויורדת).'
      },
      {
        text: 'ב-' + tex(`x=${q}`) + ' הנגזרת עוברת מ-⊖ ל-⊕, לכן זו',
        fieldId: 'q14b_s2b',
        ...makeOptions('נקודת מינימום', ['נקודת מקסימום']),
        scoring: false,
        explanation: '⊖ → ⊕ = ירידה ואז עלייה → נקודת מינימום.'
      },
      {
        text: 'שלב 4: ' + tex('f') + ' עולה כאשר',
        fieldId: 'q14b_s3',
        ...makeOptions(
          tex(`x < ${r} \\heb{ או } x > ${q}`),
          [
            tex(`${r} < x < ${q}`),
            tex(`x < ${p} \\heb{ או } x > ${q}`),
            tex(`x > ${r}`)
          ]
        ),
        scoring: false,
        explanation: 'הפונקציה עולה בתחומים בהם הנגזרת חיובית (⊕).'
      },
      {
        text: tex('f') + ' יורדת כאשר',
        fieldId: 'q14b_final',
        ...makeOptions(
          tex(`${r} < x < ${q}`),
          [
            tex(`x < ${r} \\heb{ או } x > ${q}`),
            tex(`x < ${q}`),
            tex(`${p} < x < ${q}`)
          ]
        ),
        scoring: true,
        explanation: 'הפונקציה יורדת בתחומים בהם הנגזרת שלילית (⊖).'
      }
    ]
  };
}

// =====================================================================
//  יצירת כל השאלות + בניית DOM
// =====================================================================

let questions = [];

function generateAllQuestions() {
  const q5a = genQ5a();
  const q14a = genQ14a();
  questions = [
    genQ1(), genQ2(), genQ3(), genQ4(),
    q5a, genQ5b(), genQ5c(),
    genQ6(), genQ7(), genQ8(), genQ9(),
    genQ10(), genQ11(), genQ12(), genQ13(),
    q14a, genQ14b()
  ];
}

const numMap = {
  'q1': '1', 'q2': '2', 'q3': '3', 'q4': '4',
  'q5a': '5\u05D0', 'q5b': '5\u05D1', 'q5c': '5\u05D2',
  'q6': '6', 'q7': '7', 'q8': '8', 'q9': '9',
  'q10': '10', 'q11': '11', 'q12': '12', 'q13': '13',
  'q14a': '14\u05D0', 'q14b': '14\u05D1'
};

const sectionLabels = {
  a: { name: 'נגזרת מורכבת', icon: '🔗' },
  b: { name: 'חקירת פונקציה מורכבת', icon: '🔍' },
  c: { name: 'נגזרת מכפלה', icon: '✖️' },
  d: { name: 'הוצאת גורם משותף', icon: '🧩' },
  e: { name: 'חקירת פונקציה — מכפלה', icon: '📊' }
};

function buildQuiz() {
  generateAllQuestions();

  const sections = {
    a: document.getElementById('section-a-questions'),
    b: document.getElementById('section-b-questions'),
    c: document.getElementById('section-c-questions'),
    d: document.getElementById('section-d-questions'),
    e: document.getElementById('section-e-questions')
  };
  Object.values(sections).forEach(s => s.innerHTML = '');

  questions.forEach((q) => {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.id = `card-${q.id}`;

    const displayNum = numMap[q.id] || q.id;
    const weightLabel = q.weight === 10 ? '10 \u05E0\u05E7\u05F3' : '5 \u05E0\u05E7\u05F3';
    const prefix = q.titlePrefix ? q.titlePrefix + ' ' : '';
    const suffix = q.titleSuffix ? ' ' + q.titleSuffix : '';

    let html = `
      <div class="question-title">
        <span class="question-number">${displayNum}</span>
        <span dir="rtl">${prefix}${q.title}${suffix}</span>
        <span class="question-weight">${weightLabel}</span>
      </div>
    `;

    // Hint button
    if (q.hint) {
      html += `
        <div class="hint-container" id="hint-container-${q.id}">
          <button class="hint-btn" onclick="toggleHint('${q.id}')" type="button">💡 רמז</button>
          <div class="hint-text" id="hint-${q.id}">${q.hint}</div>
        </div>
      `;
    }

    if (q.type === 'guided') {
      html += buildGuidedQuestion(q);
    } else if (q.type === 'radio') {
      html += buildRadioQuestion(q);
    }

    // Graph button for investigation questions
    if (q.graphExpr) {
      html += `<button class="graph-btn" onclick="showGraph('${q.id}')" type="button">📈 הצג גרף</button>`;
    }

    html += `<div class="correction-text" id="correction-${q.id}"></div>`;
    card.innerHTML = html;
    sections[q.section].appendChild(card);
  });

  attachStepFeedback();
  loadFromLocalStorage();
  updateProgress();

  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    MathJax.typesetPromise();
  } else {
    const waitForMJ = setInterval(() => {
      if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
        clearInterval(waitForMJ);
        MathJax.typesetPromise();
      }
    }, 200);
    setTimeout(() => clearInterval(waitForMJ), 10000);
  }

  requestAnimationFrame(() => {
    const cards = document.querySelectorAll('.question-card');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
    cards.forEach((card, i) => {
      card.style.animationDelay = `${i * 0.07}s`;
      observer.observe(card);
    });
  });
}

// =====================================================================
//  Feature 1 + 5: Per-step feedback + Step locking
// =====================================================================

function attachStepFeedback() {
  questions.forEach(q => {
    if (q.type !== 'guided') return;
    q.steps.forEach((step, idx) => {
      const sel = document.getElementById(step.fieldId);
      if (!sel) return;

      if (idx > 0) {
        sel.disabled = true;
        const stepDiv = document.getElementById(`step-${step.fieldId}`);
        if (stepDiv) stepDiv.classList.add('step-locked');
      }

      sel.addEventListener('change', () => {
        handleStepChange(q, step, idx);
        saveToLocalStorage();
        updateProgress();
      });
    });
  });
}

function handleStepChange(q, step, idx) {
  const sel = document.getElementById(step.fieldId);
  const val = sel.value;
  const stepDiv = document.getElementById(`step-${step.fieldId}`);

  if (val === '\u05D1\u05D7\u05E8/\u05D9...' || val === '') return;

  sel.classList.remove('correct-answer', 'wrong-answer');
  stepDiv.querySelectorAll('.step-feedback, .step-explanation').forEach(el => el.remove());

  const isCorrect = val === step.correct;

  // aria-live feedback region
  const liveRegion = stepDiv.querySelector('.step-live-feedback');

  if (isCorrect) {
    sel.classList.add('correct-answer');
    const fb = document.createElement('span');
    fb.className = 'step-feedback step-feedback-correct';
    fb.textContent = '✓';
    stepDiv.appendChild(fb);
    if (liveRegion) liveRegion.textContent = 'תשובה נכונה';

    if (idx < q.steps.length - 1) {
      const nextStep = q.steps[idx + 1];
      const nextSel = document.getElementById(nextStep.fieldId);
      const nextDiv = document.getElementById(`step-${nextStep.fieldId}`);
      if (nextSel) {
        nextSel.disabled = false;
        if (nextDiv) nextDiv.classList.remove('step-locked');
        // Move focus to the newly unlocked step
        setTimeout(() => nextSel.focus(), 150);
      }
    }

    updateProgress();
  } else {
    sel.classList.add('wrong-answer');
    const fb = document.createElement('span');
    fb.className = 'step-feedback step-feedback-wrong';
    fb.textContent = '✗';
    stepDiv.appendChild(fb);
    if (liveRegion) liveRegion.textContent = 'תשובה שגויה, נסו שוב';

    if (step.explanation) {
      const expDiv = document.createElement('div');
      expDiv.className = 'step-explanation show';
      expDiv.innerHTML = `<strong>💡</strong> ${step.explanation}`;
      stepDiv.appendChild(expDiv);

      if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
        MathJax.typesetPromise([expDiv]);
      }
    }

    setTimeout(() => {
      sel.classList.remove('wrong-answer');
      sel.value = '\u05D1\u05D7\u05E8/\u05D9...';
      const wrongFb = stepDiv.querySelector('.step-feedback-wrong');
      if (wrongFb) wrongFb.remove();
      if (liveRegion) liveRegion.textContent = '';
    }, 2500);
  }
}

// =====================================================================
//  Feature 2: Hints
// =====================================================================

function toggleHint(qId) {
  const hintDiv = document.getElementById(`hint-${qId}`);
  const btn = hintDiv.previousElementSibling;
  if (hintDiv.classList.contains('show')) {
    hintDiv.classList.remove('show');
    btn.textContent = '💡 רמז';
  } else {
    hintDiv.classList.add('show');
    btn.textContent = '💡 הסתר רמז';
  }
}

// =====================================================================
//  Feature 8: localStorage
// =====================================================================

function saveToLocalStorage() {
  try {
    const data = {};
    const nameInput = document.getElementById('student-name');
    if (nameInput) data.studentName = nameInput.value;

    questions.forEach(q => {
      if (q.type === 'guided') {
        q.steps.forEach(step => {
          const sel = document.getElementById(step.fieldId);
          if (sel && sel.value !== '\u05D1\u05D7\u05E8/\u05D9...') data[step.fieldId] = sel.value;
        });
      } else if (q.type === 'radio') {
        const checked = document.querySelector(`input[name="${q.id}"]:checked`);
        if (checked) data[`radio_${q.id}`] = checked.value;
      }
    });

    localStorage.setItem('homework_progress', JSON.stringify(data));
  } catch (e) {}
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('homework_progress');
    if (!raw) return;
    const data = JSON.parse(raw);

    if (data.studentName) {
      document.getElementById('student-name').value = data.studentName;
    }

    questions.forEach(q => {
      if (q.type === 'guided') {
        q.steps.forEach((step, idx) => {
          const sel = document.getElementById(step.fieldId);
          if (sel && data[step.fieldId]) {
            sel.disabled = false;
            const stepDiv = document.getElementById(`step-${step.fieldId}`);
            if (stepDiv) stepDiv.classList.remove('step-locked');

            sel.value = data[step.fieldId];
            if (sel.value === step.correct) {
              sel.classList.add('correct-answer');
              const fb = document.createElement('span');
              fb.className = 'step-feedback step-feedback-correct';
              fb.textContent = '✓';
              if (stepDiv) stepDiv.appendChild(fb);
              if (idx < q.steps.length - 1) {
                const nextSel = document.getElementById(q.steps[idx + 1].fieldId);
                const nextDiv = document.getElementById(`step-${q.steps[idx + 1].fieldId}`);
                if (nextSel) nextSel.disabled = false;
                if (nextDiv) nextDiv.classList.remove('step-locked');
              }
            }
          }
        });
      } else if (q.type === 'radio') {
        const savedVal = data[`radio_${q.id}`];
        if (savedVal) {
          const radios = document.querySelectorAll(`input[name="${q.id}"]`);
          radios.forEach(r => { if (r.value === savedVal) r.checked = true; });
        }
      }
    });
  } catch (e) {}
}

function clearLocalStorage() {
  try { localStorage.removeItem('homework_progress'); } catch (e) {}
}

// =====================================================================
//  Build DOM helpers
// =====================================================================

function buildGuidedQuestion(q) {
  let html = '';
  const displayNum = numMap[q.id] || q.id;
  q.steps.forEach((step, idx) => {
    const displayOptions = step.options.map(opt => latexToUnicode(opt));
    const ariaLabel = `שאלה ${displayNum}, שלב ${idx + 1}: ${step.text.replace(/<[^>]*>/g, '').replace(/\\\([^)]*\\\)/g, 'ביטוי מתמטי')}`;
    html += `
      <div class="guided-step" id="step-${step.fieldId}">
        <span dir="rtl">${step.text}</span>
        <span class="inline-select">
          <select id="${step.fieldId}" data-correct="${step.correct}" data-scoring="${step.scoring}" aria-label="${ariaLabel}">
            ${step.options.map((opt, i) => `<option value="${opt}">${displayOptions[i]}</option>`).join('')}
          </select>
        </span>
        <span class="step-live-feedback" aria-live="polite"></span>
      </div>
    `;
  });
  return html;
}

function latexToUnicode(latex) {
  let s = latex;
  if (!s.startsWith('\\(')) return s;
  s = s.replace(/^\\\(/, '').replace(/\\\)$/, '').trim();
  const supMap = { '0': '\u2070', '1': '\u00B9', '2': '\u00B2', '3': '\u00B3', '4': '\u2074', '5': '\u2075', '6': '\u2076', '7': '\u2077', '8': '\u2078', '9': '\u2079', '-': '\u207B', '(': '\u207D', ')': '\u207E' };
  s = s.replace(/\^{([^}]+)}/g, (_, exp) => exp.split('').map(c => supMap[c] || c).join(''));
  s = s.replace(/\^([0-9])/g, (_, c) => supMap[c] || c);
  s = s.replace(/\\cdot/g, '\u00B7');
  s = s.replace(/\\frac{([^}]+)}{([^}]+)}/g, '$1/$2');
  s = s.replace(/\\infty/g, '\u221E');
  s = s.replace(/\\cup/g, '\u222A');
  s = s.replace(/\\tfrac{([^}]+)}{([^}]+)}/g, '$1/$2');
  s = s.replace(/\\;/g, ' ');
  s = s.replace(/\\text{([^}]*)}/g, '$1');
  s = s.replace(/\\heb{([^}]*)}/g, '$1');
  s = s.replace(/\\unicode{x200F}/g, '');
  s = s.replace(/\\left|\\right/g, '');
  return s;
}

function buildRadioQuestion(q) {
  const displayNum = numMap[q.id] || q.id;
  let html = `<p class="section-hint" dir="rtl">${q.prompt}</p>`;
  html += `<div class="radio-group" id="radio-${q.id}" role="radiogroup" aria-label="שאלה ${displayNum}: ${q.prompt.replace(/<[^>]*>/g, '')}">`;
  q.options.forEach((opt, i) => {
    html += `
      <div class="radio-option" id="opt-${q.id}-${i}">
        <input type="radio" name="${q.id}" id="r-${q.id}-${i}" value="${opt}" onchange="saveToLocalStorage(); updateProgress();">
        <label for="r-${q.id}-${i}">${opt}</label>
        <span class="correct-indicator">\u2713 \u05EA\u05E9\u05D5\u05D1\u05D4 \u05E0\u05DB\u05D5\u05E0\u05D4</span>
      </div>
    `;
  });
  html += '</div>';
  return html;
}

// =====================================================================
//  Feature 4: Partial credit + check answers
// =====================================================================

// =====================================================================
//  Progress bar + pre-submit helpers
// =====================================================================

function countAnswered() {
  let answered = 0;
  questions.forEach(q => {
    if (q.type === 'guided') {
      const finalStep = q.steps.find(s => s.scoring);
      if (finalStep) {
        const sel = document.getElementById(finalStep.fieldId);
        if (sel && sel.value !== '\u05D1\u05D7\u05E8/\u05D9...' && sel.value !== '') answered++;
      }
    } else if (q.type === 'radio') {
      const checked = document.querySelector(`input[name="${q.id}"]:checked`);
      if (checked) answered++;
    }
  });
  return answered;
}

function updateProgress() {
  const bar = document.getElementById('progress-fill');
  const label = document.getElementById('progress-label');
  if (!bar || !label) return;

  let answered = 0;
  const total = questions.length;

  questions.forEach(q => {
    if (q.type === 'guided') {
      const finalStep = q.steps.find(s => s.scoring);
      if (finalStep) {
        const sel = document.getElementById(finalStep.fieldId);
        if (sel && sel.value !== '\u05D1\u05D7\u05E8/\u05D9...' && sel.value !== '') answered++;
      }
    } else if (q.type === 'radio') {
      const checked = document.querySelector(`input[name="${q.id}"]:checked`);
      if (checked) answered++;
    }
  });

  const pct = Math.round((answered / total) * 100);
  bar.style.width = pct + '%';
  label.textContent = `${answered} / ${total} שאלות`;
}

function checkAnswers() {
  // Confirmation dialog
  const answered = countAnswered();
  const total = questions.length;
  const msg = answered < total
    ? `ענית על ${answered} מתוך ${total} שאלות. שאלות שלא נענו ייחשבו כשגויות.\nלשלוח?`
    : `ענית על כל ${total} השאלות. לשלוח?`;
  if (!confirm(msg)) return;

  const studentName = document.getElementById('student-name').value.trim();
  if (!studentName) {
    const errMsg = document.getElementById('name-error');
    errMsg.style.display = 'block';
    errMsg.textContent = '\u26A0\uFE0F \u05D9\u05E9 \u05DC\u05D4\u05D6\u05D9\u05DF \u05E9\u05DD \u05DC\u05E4\u05E0\u05D9 \u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05EA\u05E9\u05D5\u05D1\u05D5\u05EA';
    document.getElementById('student-name').focus();
    return;
  }
  document.getElementById('name-error').style.display = 'none';

  let totalScore = 0;
  let maxScore = 0;
  const wrongQuestions = [];
  const wrongDetails = [];
  const sectionScores = {};

  Object.keys(sectionLabels).forEach(s => {
    sectionScores[s] = { earned: 0, max: 0, correct: 0, total: 0 };
  });

  questions.forEach((q) => {
    const card = document.getElementById(`card-${q.id}`);
    const correctionDiv = document.getElementById(`correction-${q.id}`);
    let questionEarned = 0;
    let questionMax = q.weight;

    if (q.type === 'guided') {
      const scoredSteps = q.steps.filter(s => s.options.length > 2);
      const totalSteps = scoredSteps.length || 1;
      let correctSteps = 0;

      q.steps.forEach((step) => {
        const sel = document.getElementById(step.fieldId);
        const val = sel.value;
        sel.classList.remove('correct-answer', 'wrong-answer');
        const stepDiv = document.getElementById(`step-${step.fieldId}`);
        stepDiv.querySelectorAll('.step-feedback, .step-explanation').forEach(el => el.remove());

        if (val === '\u05D1\u05D7\u05E8/\u05D9...' || val === '') {
          sel.classList.add('wrong-answer');
        } else if (val === step.correct) {
          sel.classList.add('correct-answer');
          if (step.options.length > 2) correctSteps++;
        } else {
          sel.classList.add('wrong-answer');
          if (step.explanation) {
            const expDiv = document.createElement('div');
            expDiv.className = 'step-explanation show';
            expDiv.innerHTML = `<strong>💡</strong> ${step.explanation}`;
            stepDiv.appendChild(expDiv);
          }
        }
        sel.disabled = true;
      });

      questionEarned = Math.round((correctSteps / totalSteps) * q.weight * 10) / 10;
      const isFullyCorrect = correctSteps === totalSteps;

      if (!isFullyCorrect) {
        const finalStep = q.steps.find(s => s.scoring);
        correctionDiv.innerHTML = `\u2713 \u05D4\u05EA\u05E9\u05D5\u05D1\u05D4 \u05D4\u05E0\u05DB\u05D5\u05E0\u05D4: ${finalStep.correct}`;
        correctionDiv.classList.add('show');
        wrongQuestions.push(q.id);
        wrongDetails.push(`\u05E9\u05D0\u05DC\u05D4 ${numMap[q.id] || q.id.replace('q', '')}: ${(q.titlePrefix || '')} ${q.title}`);
        card.classList.add(questionEarned > 0 ? 'partial' : 'wrong');
        card.classList.remove(questionEarned > 0 ? 'wrong' : 'partial', 'correct');
      } else {
        card.classList.add('correct');
        card.classList.remove('wrong', 'partial');
      }

    } else if (q.type === 'radio') {
      const selected = document.querySelector(`input[name="${q.id}"]:checked`);
      const selectedVal = selected ? selected.value : null;
      const isCorrect = selectedVal === q.correct;
      questionEarned = isCorrect ? q.weight : 0;

      q.options.forEach((opt, i) => {
        const optDiv = document.getElementById(`opt-${q.id}-${i}`);
        const radio = document.getElementById(`r-${q.id}-${i}`);
        optDiv.classList.remove('correct-answer', 'wrong-answer');
        if (opt === q.correct) {
          optDiv.classList.add('correct-answer');
        } else if (radio.checked && !isCorrect) {
          optDiv.classList.add('wrong-answer');
        }
        radio.disabled = true;
      });

      if (!isCorrect) {
        card.classList.add('wrong');
        card.classList.remove('correct');
        wrongQuestions.push(q.id);
        wrongDetails.push(`\u05E9\u05D0\u05DC\u05D4 ${numMap[q.id] || q.id.replace('q', '')}: ${(q.titlePrefix || '')} ${q.title}`);
        if (q.explanation) {
          correctionDiv.innerHTML = `<strong>💡 הסבר:</strong> ${q.explanation}`;
          correctionDiv.classList.add('show');
        }
      } else {
        card.classList.add('correct');
        card.classList.remove('wrong');
      }
    }

    totalScore += questionEarned;
    maxScore += questionMax;

    sectionScores[q.section].earned += questionEarned;
    sectionScores[q.section].max += questionMax;
    sectionScores[q.section].total++;
    if (questionEarned === questionMax) sectionScores[q.section].correct++;
  });

  const score = Math.round((totalScore / maxScore) * 100);

  document.getElementById('btn-submit').disabled = true;
  document.getElementById('btn-retry').style.display = 'inline-block';

  showResults(score, wrongQuestions, wrongDetails, sectionScores);
  sendToGoogleSheets(studentName, score, wrongQuestions, wrongDetails);
  document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });

  if (score >= 90) launchConfetti();

  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    MathJax.typesetPromise();
  }

  clearLocalStorage();
}

// =====================================================================
//  Feature 9: Per-topic results
// =====================================================================

function showResults(score, wrongQuestions, wrongDetails, sectionScores) {
  const resultsSection = document.getElementById('results-section');
  resultsSection.style.display = 'block';

  const progressCircle = document.getElementById('progress-circle');
  const scoreValue = document.getElementById('score-value');
  const scoreMessage = document.getElementById('score-message');
  const scoreCircle = document.getElementById('score-circle');

  scoreValue.textContent = score;

  const circumference = 440;
  const offset = circumference - (score / 100) * circumference;
  setTimeout(() => { progressCircle.style.strokeDashoffset = offset; }, 100);

  scoreCircle.classList.remove('score-excellent', 'score-good', 'score-ok', 'score-bad');
  if (score >= 90) {
    scoreCircle.classList.add('score-excellent');
    scoreMessage.textContent = '\uD83C\uDF1F \u05DE\u05E6\u05D5\u05D9\u05DF! \u05E2\u05D1\u05D5\u05D3\u05D4 \u05E0\u05D4\u05D3\u05E8\u05EA!';
    scoreMessage.style.color = 'var(--success)';
  } else if (score >= 70) {
    scoreCircle.classList.add('score-good');
    scoreMessage.textContent = '\uD83D\uDC4D \u05D8\u05D5\u05D1 \u05DE\u05D0\u05D5\u05D3! \u05DB\u05DE\u05E2\u05D8 \u05E9\u05DD!';
    scoreMessage.style.color = 'var(--primary)';
  } else if (score >= 55) {
    scoreCircle.classList.add('score-ok');
    scoreMessage.textContent = '\uD83D\uDCDA \u05DC\u05D0 \u05E8\u05E2, \u05D0\u05D1\u05DC \u05D9\u05E9 \u05DE\u05E7\u05D5\u05DD \u05DC\u05E9\u05D9\u05E4\u05D5\u05E8.';
    scoreMessage.style.color = 'var(--warning)';
  } else {
    scoreCircle.classList.add('score-bad');
    scoreMessage.textContent = '\uD83D\uDCAA \u05E6\u05E8\u05D9\u05DA \u05DC\u05EA\u05E8\u05D2\u05DC \u05E2\u05D5\u05D3 \u05E7\u05E6\u05EA. \u05D0\u05DC \u05EA\u05D5\u05D5\u05EA\u05E8/\u05D9!';
    scoreMessage.style.color = 'var(--error)';
  }

  // Per-topic breakdown
  let breakdownHtml = '<div class="topic-breakdown"><h3>📊 פירוט לפי נושא:</h3>';
  Object.keys(sectionLabels).forEach(s => {
    const info = sectionLabels[s];
    const sc = sectionScores[s];
    const pct = sc.max > 0 ? Math.round((sc.earned / sc.max) * 100) : 0;
    let statusClass = 'topic-excellent';
    let statusIcon = '🌟';
    if (pct < 55) { statusClass = 'topic-bad'; statusIcon = '❌'; }
    else if (pct < 70) { statusClass = 'topic-ok'; statusIcon = '⚠️'; }
    else if (pct < 90) { statusClass = 'topic-good'; statusIcon = '👍'; }

    breakdownHtml += `
      <div class="topic-row ${statusClass}">
        <span class="topic-name">${info.icon} ${info.name}</span>
        <div class="topic-bar-container">
          <div class="topic-bar" style="width: ${pct}%"></div>
        </div>
        <span class="topic-score">${statusIcon} ${pct}%</span>
      </div>
    `;
  });
  breakdownHtml += '</div>';

  const detailsDiv = document.getElementById('results-details');
  if (wrongQuestions.length === 0) {
    detailsDiv.innerHTML = breakdownHtml + '<div class="all-correct">\uD83C\uDF89 \u05E2\u05E0\u05D9\u05EA \u05E0\u05DB\u05D5\u05DF \u05E2\u05DC \u05DB\u05DC \u05D4\u05E9\u05D0\u05DC\u05D5\u05EA! \u05DB\u05DC \u05D4\u05DB\u05D1\u05D5\u05D3!</div>';
  } else {
    let listHtml = `<h3>\u05E9\u05D0\u05DC\u05D5\u05EA \u05E9\u05D2\u05D5\u05D9\u05D5\u05EA (${wrongQuestions.length}):</h3><ul>`;
    wrongDetails.forEach(d => { listHtml += `<li>${d}</li>`; });
    listHtml += '</ul>';
    detailsDiv.innerHTML = breakdownHtml + listHtml;
  }

  // Render MathJax in the dynamically-created results
  if (window.MathJax && typeof MathJax.typesetPromise === 'function') {
    MathJax.typesetPromise([detailsDiv]);
  }
}

// =====================================================================
//  Feature 10: Confetti
// =====================================================================

function launchConfetti() {
  const canvas = document.createElement('canvas');
  canvas.id = 'confetti-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#4361ee', '#7c3aed', '#2ecc71', '#f39c12', '#e74c3c', '#06b6d4', '#22c55e', '#ff6b6b', '#ffd93d'];
  const particles = [];

  for (let i = 0; i < 150; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      vx: (Math.random() - 0.5) * 6,
      vy: Math.random() * 3 + 2,
      w: Math.random() * 10 + 5,
      h: Math.random() * 6 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      opacity: 1
    });
  }

  let frame = 0;
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame++;
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rotation += p.rotSpeed;
      if (frame > 100) p.opacity -= 0.01;
      if (p.opacity <= 0) return;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.opacity);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (frame < 200 && particles.some(p => p.opacity > 0)) {
      requestAnimationFrame(animate);
    } else {
      canvas.remove();
    }
  }
  animate();
}

// =====================================================================
//  Feature 7: Interactive graph
// =====================================================================

function showGraph(qId) {
  const q = questions.find(q => q.id === qId);
  if (!q || !q.graphExpr) return;

  const existing = document.getElementById(`graph-${qId}`);
  if (existing) { existing.remove(); return; }

  const card = document.getElementById(`card-${qId}`);
  const graphDiv = document.createElement('div');
  graphDiv.id = `graph-${qId}`;
  graphDiv.className = 'graph-container';
  graphDiv.innerHTML = `
    <div class="graph-header">
      <span>📈 גרף הפונקציה</span>
      <button onclick="document.getElementById('graph-${qId}').remove()" class="graph-close-btn" type="button">✕</button>
    </div>
    <div id="graph-frame-${qId}" class="graph-frame"></div>
  `;
  card.appendChild(graphDiv);
  drawGraph(`graph-frame-${qId}`, q.graphExpr);
}

function drawGraph(containerId, expr) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const canvas = document.createElement('canvas');
  // Dynamic sizing based on container width
  const containerWidth = Math.min(container.clientWidth || 500, 500);
  const ratio = 0.6; // height/width aspect ratio
  canvas.width = containerWidth * (window.devicePixelRatio || 1);
  canvas.height = containerWidth * ratio * (window.devicePixelRatio || 1);
  canvas.style.width = containerWidth + 'px';
  canvas.style.height = (containerWidth * ratio) + 'px';
  canvas.style.display = 'block';
  canvas.style.margin = '0 auto';
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  const W = containerWidth;
  const H = containerWidth * ratio;

  const fn = (x) => {
    try {
      let e = expr.replace(/x/g, `(${x})`);
      return Function('"use strict"; return (' + e + ')')();
    } catch { return NaN; }
  };

  const xMin = -8, xMax = 8;
  let yMin = Infinity, yMax = -Infinity;
  for (let px = 0; px <= W; px++) {
    const x = xMin + (px / W) * (xMax - xMin);
    const y = fn(x);
    if (isFinite(y)) {
      yMin = Math.min(yMin, y);
      yMax = Math.max(yMax, y);
    }
  }
  const yPad = (yMax - yMin) * 0.15 || 5;
  yMin -= yPad;
  yMax += yPad;

  const toX = (x) => ((x - xMin) / (xMax - xMin)) * W;
  const toY = (y) => H - ((y - yMin) / (yMax - yMin)) * H;

  // Background
  ctx.fillStyle = '#fafbfc';
  ctx.fillRect(0, 0, W, H);

  // Grid
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 0.5;
  for (let x = Math.ceil(xMin); x <= Math.floor(xMax); x++) {
    const px = toX(x);
    ctx.beginPath(); ctx.moveTo(px, 0); ctx.lineTo(px, H); ctx.stroke();
    if (x !== 0) {
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(x, px, toY(0) + 14);
    }
  }

  // Axes
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1.5;
  if (yMin <= 0 && yMax >= 0) {
    const ay = toY(0);
    ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.stroke();
  }
  if (xMin <= 0 && xMax >= 0) {
    const ax = toX(0);
    ctx.beginPath(); ctx.moveTo(ax, 0); ctx.lineTo(ax, H); ctx.stroke();
  }

  // Curve
  ctx.strokeStyle = '#4361ee';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  let started = false;
  for (let px = 0; px <= W; px++) {
    const x = xMin + (px / W) * (xMax - xMin);
    const y = fn(x);
    if (!isFinite(y)) { started = false; continue; }
    const cy = toY(y);
    if (cy < -100 || cy > H + 100) { started = false; continue; }
    if (!started) { ctx.moveTo(px, cy); started = true; }
    else ctx.lineTo(px, cy);
  }
  ctx.stroke();
}

// =====================================================================
//  Google Sheets
// =====================================================================

async function sendToGoogleSheets(studentName, score, wrongQuestions, wrongDetails) {
  const statusDiv = document.getElementById('sending-status');
  statusDiv.innerHTML = '<span class="spinner"></span> \u05E9\u05D5\u05DC\u05D7 \u05EA\u05D5\u05E6\u05D0\u05D5\u05EA...';
  statusDiv.className = 'sending-status';

  const googleScriptUrl = getGoogleScriptUrl();

  if (googleScriptUrl === DEFAULT_GOOGLE_SCRIPT_URL) {
    statusDiv.textContent = '\u26A0\uFE0F \u05DC\u05D0 \u05D4\u05D5\u05D2\u05D3\u05E8 URL \u05E9\u05DC Google Apps Script. \u05D4\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05DC\u05D0 \u05E0\u05E9\u05DC\u05D7\u05D5.';
    statusDiv.className = 'sending-status error';
    return;
  }

  try {
    await fetch(googleScriptUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentName, score, totalQuestions: questions.length, wrongQuestions, wrongDetails })
    });
    statusDiv.textContent = '\u2705 \u05D4\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA \u05E0\u05E9\u05DC\u05D7\u05D5 \u05D1\u05D4\u05E6\u05DC\u05D7\u05D4!';
    statusDiv.className = 'sending-status success';
  } catch (error) {
    console.error('Error sending to Google Sheets:', error);
    statusDiv.textContent = '\u274C \u05E9\u05D2\u05D9\u05D0\u05D4 \u05D1\u05E9\u05DC\u05D9\u05D7\u05EA \u05D4\u05EA\u05D5\u05E6\u05D0\u05D5\u05EA. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1 \u05DE\u05D0\u05D5\u05D7\u05E8 \u05D9\u05D5\u05EA\u05E8.';
    statusDiv.className = 'sending-status error';
  }
}

// =====================================================================
//  Retry + Init
// =====================================================================

function retryQuiz() {
  document.getElementById('results-section').style.display = 'none';
  document.getElementById('progress-circle').style.strokeDashoffset = 440;
  document.getElementById('sending-status').textContent = '';
  document.getElementById('btn-submit').disabled = false;
  document.getElementById('btn-retry').style.display = 'none';
  clearLocalStorage();
  buildQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.addEventListener('DOMContentLoaded', () => {
  const googleScriptInput = document.getElementById('google-script-url');
  const googleScriptSaveBtn = document.getElementById('btn-save-google-script');
  if (googleScriptInput) {
    const currentUrl = getGoogleScriptUrl();
    googleScriptInput.value = currentUrl === DEFAULT_GOOGLE_SCRIPT_URL ? '' : currentUrl;
  }
  if (googleScriptSaveBtn) {
    googleScriptSaveBtn.addEventListener('click', saveGoogleScriptUrl);
  }
  if (googleScriptInput) {
    googleScriptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveGoogleScriptUrl();
      }
    });
  }

  buildQuiz();
  document.getElementById('btn-submit').addEventListener('click', checkAnswers);
  document.getElementById('btn-retry').addEventListener('click', retryQuiz);
  document.getElementById('student-name').addEventListener('input', () => {
    document.getElementById('name-error').style.display = 'none';
    saveToLocalStorage();
  });
});
