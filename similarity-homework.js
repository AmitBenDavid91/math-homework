// =============================================================
// מטלת דמיון משולשים — עמוד עצמאי (לא תלוי בדף הנגזרות)
// =============================================================

const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby7piOmLUYOo6AwkpragXdu2eyQiXmULIF4Dn9gticn_A4EO5v07Y5onA3Padas0zCB2w/exec';
const SHEET_NAME = 'דמיון משולשים';

const baseQuestions = [
  {
    id: 'q1',
    prompt: 'אם \(\angle A = \angle D\) וגם \(\angle B = \angle E\), אז:',
    options: ['המשולשים דומים', 'המשולשים חופפים', 'אין מספיק מידע', 'רק ההיקפים שווים'],
    correct: 'המשולשים דומים',
    explanation: 'לפי משפט ז.ז: שתי זוויות שוות בהתאמה מספיקות לדמיון.'
  },
  {
    id: 'q2',
    prompt: 'נתון \(\triangle ABC \sim \triangle DEF\). אם \(\frac{AB}{DE}=\frac{3}{2}\) ו-\(DE=8\), אז \(AB=\ ?\)',
    options: ['12', '10', '6', '16'],
    correct: '12',
    explanation: 'יחס הצלעות הוא 3/2, לכן AB = 8·(3/2)=12.'
  },
  {
    id: 'q3',
    prompt: 'אם יחס הדמיון הוא \(k=2\), אז יחס השטחים הוא:',
    options: ['2', '4', '8', '1/2'],
    correct: '4',
    explanation: 'יחס שטחים הוא \(k^2\).'
  },
  {
    id: 'q4',
    prompt: 'במשולש, אם \(DE \parallel BC\) ו-\(D\) על \(AB\), \(E\) על \(AC\), אז:',
    options: ['\(\triangle ADE \sim \triangle ABC\)', '\(\triangle ADE\) חופף ל-\(\triangle ABC\)', 'המשולשים אינם קשורים', 'אין אפשרות לדעת'],
    correct: '\(\triangle ADE \sim \triangle ABC\)',
    explanation: 'מקבילים יוצרים זוויות מתאימות שוות ולכן דמיון.'
  },
  {
    id: 'q5',
    prompt: 'אם יחס הדמיון גדול:קטן הוא \(5:3\), אז יחס ההיקפים גדול:קטן הוא:',
    options: ['5:3', '25:9', '3:5', '15:8'],
    correct: '5:3',
    explanation: 'יחס ההיקפים זהה ליחס הדמיון.'
  },
  {
    id: 'q6',
    prompt: 'אם \(\frac{AB}{DE}=\frac{AC}{DF}=\frac{BC}{EF}\), אז הקריטריון הוא:',
    options: ['ז.ז', 'צ.ז.צ', 'צ.צ.צ', 'חפיפה'],
    correct: 'צ.צ.צ',
    explanation: 'שלוש צלעות פרופורציונליות ⇒ דמיון לפי צ.צ.צ.'
  },
  {
    id: 'q7',
    prompt: 'נתון יחס שטחים \(49:16\). יחס הדמיון המתאים הוא:',
    options: ['49:16', '7:4', '14:8', '4:7'],
    correct: '7:4',
    explanation: 'שורש יחס השטחים נותן יחס דמיון.'
  },
  {
    id: 'q8',
    prompt: 'במשולשים דומים, הזוויות המתאימות הן:',
    options: ['שוות', 'ביחס הדמיון', 'משלימות ל-180°', 'לא קבועות'],
    correct: 'שוות',
    explanation: 'בדמיון נשמרות כל הזוויות.'
  },
  {
    id: 'q9',
    prompt: 'אם \(\triangle ABC \sim \triangle DEF\), \(AB=15\), \(DE=10\), \(EF=14\). מצאו את \(BC\).',
    options: ['21', '20', '9', '24'],
    correct: '21',
    explanation: 'יחס הגדול לקטן הוא 15/10=3/2, לכן BC = 14·(3/2)=21.'
  },
  {
    id: 'q10',
    prompt: 'איזה מידע אינו מספיק לבדו להוכחת דמיון?',
    options: ['שתי זוויות שוות', 'שלוש צלעות פרופורציונליות', 'זווית אחת וצלע אחת בלבד', 'צ.ז.צ בדמיון'],
    correct: 'זווית אחת וצלע אחת בלבד',
    explanation: 'נדרשים קריטריונים מלאים לדמיון.'
  },
  {
    id: 'q11',
    prompt: 'אם יחס הדמיון קטן:גדול הוא \(2:3\) ו-\(AC_{גדול}=27\), אז \(AC_{קטן}=\ ?\)',
    options: ['18', '16', '20', '9'],
    correct: '18',
    explanation: 'הקטן = 27·(2/3)=18.'
  },
  {
    id: 'q12',
    prompt: 'אם במשולש ישר-זווית מורידים גובה ליתר, מתקבלים שני משולשים:',
    options: ['דומים למשולש המקורי וגם זה לזה', 'חופפים למשולש המקורי', 'לא דומים כלל', 'דומים רק אם הניצבים שווים'],
    correct: 'דומים למשולש המקורי וגם זה לזה',
    explanation: 'תכונה קלאסית במשולש ישר-זווית עם גובה ליתר.'
  }
];

let questions = [];
let lastCheckData = null;

const quizContainer = document.getElementById('quiz-container');
const submitBtn = document.getElementById('btn-submit');
const retryBtn = document.getElementById('btn-retry');
const sendBtn = document.getElementById('btn-send');
const resultsBox = document.getElementById('results');
const scoreLine = document.getElementById('score-line');
const wrongList = document.getElementById('wrong-list');
const studentNameInput = document.getElementById('student-name');
const nameError = document.getElementById('name-error');

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildQuiz() {
  questions = baseQuestions.map((q) => ({ ...q, options: shuffle(q.options) }));
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
        </label>
      `;
    });

    card.innerHTML = `
      <div class="question-title">שאלה ${idx + 1}: ${q.prompt}</div>
      <div class="options">${optionsHtml}</div>
      <div class="feedback" id="feedback-${q.id}"></div>
      <div class="explanation" id="explanation-${q.id}"></div>
    `;

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
  const wrongDetails = [];
  const questionStatusById = {};
  const questionOrder = questions.map(q => q.id);

  questions.forEach((q, idx) => {
    const feedback = document.getElementById(`feedback-${q.id}`);
    const explanation = document.getElementById(`explanation-${q.id}`);
    const selected = document.querySelector(`input[name="${q.id}"]:checked`);

    feedback.className = 'feedback';
    feedback.textContent = '';
    explanation.textContent = '';

    const isCorrect = selected && selected.value === q.correct;

    if (isCorrect) {
      correctCount++;
      feedback.classList.add('ok');
      feedback.textContent = '✓ נכון';
      questionStatusById[q.id] = 'נכון';
    } else {
      feedback.classList.add('bad');
      feedback.textContent = '✗ אין מענה נכון';
      explanation.textContent = q.explanation || '';
      questionStatusById[q.id] = 'אין מענה נכון';
      wrongQuestions.push(q.id);
      wrongDetails.push(`שאלה ${idx + 1}: ${q.prompt}`);
    }
  });

  const totalQuestions = questions.length;
  const score = Math.round((correctCount / totalQuestions) * 100);

  scoreLine.textContent = `ציון סופי: ${score}%  (${correctCount} מתוך ${totalQuestions})`;
  wrongList.innerHTML = wrongQuestions.length
    ? `<strong>שאלות לתרגול נוסף:</strong> ${wrongQuestions.map((id, i) => `שאלה ${i + 1}`).join(' , ')}`
    : '<span style="color:var(--success)">כל הכבוד! כל התשובות נכונות 🎉</span>';

  resultsBox.classList.remove('hidden');

  lastCheckData = {
    studentName,
    score,
    totalQuestions,
    wrongQuestions,
    wrongDetails,
    questionOrder,
    questionStatusById
  };
}

async function sendToGoogleSheets() {
  if (!lastCheckData) {
    checkAnswers();
    if (!lastCheckData) return;
  }

  const payload = {
    ...lastCheckData,
    sheetName: SHEET_NAME
  };

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
  } catch (error) {
    alert('שגיאה בשליחת התוצאות: ' + error.message);
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = '📤 שלח תוצאות לגיליון';
  }
}

function retryHomework() {
  resultsBox.classList.add('hidden');
  scoreLine.textContent = '';
  wrongList.textContent = '';
  lastCheckData = null;
  buildQuiz();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

submitBtn.addEventListener('click', checkAnswers);
retryBtn.addEventListener('click', retryHomework);
sendBtn.addEventListener('click', sendToGoogleSheets);
studentNameInput.addEventListener('input', () => { nameError.style.display = 'none'; });

buildQuiz();
