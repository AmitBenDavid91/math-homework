// =============================================================
// Google Apps Script — הדבק את הקוד הזה בעורך הסקריפט של Google Sheets
// =============================================================
// שלבים:
// 1. צור Google Sheet חדש
// 2. לחץ על Extensions > Apps Script
// 3. הדבק את הקוד הזה ושמור
// 4. לחץ Deploy > New Deployment
// 5. בחר Type = Web App
// 6. הגדר Execute as = Me, Who has access = Anyone
// 7. לחץ Deploy והעתק את ה-URL
// 8. הדבק את ה-URL בקובץ script.js במשתנה GOOGLE_SCRIPT_URL
// =============================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents || '{}');

    var questionOrder = data.questionOrder || [
      'q1', 'q2', 'q3', 'q4',
      'q5a', 'q5b', 'q5c',
      'q6', 'q7', 'q8', 'q9',
      'q10', 'q11', 'q12', 'q13',
      'q14a', 'q14b'
    ];

    var questionLabels = {
      q1: '1', q2: '2', q3: '3', q4: '4',
      q5a: '5א', q5b: '5ב', q5c: '5ג',
      q6: '6', q7: '7', q8: '8', q9: '9',
      q10: '10', q11: '11', q12: '12', q13: '13',
      q14a: '14א', q14b: '14ב'
    };

    var headers = ['שם התלמיד'];
    for (var i = 0; i < questionOrder.length; i++) {
      var id = questionOrder[i];
      headers.push('שאלה ' + (questionLabels[id] || id));
    }
    headers.push('ציון סופי');

    // יצירת/עדכון כותרות שורה ראשונה
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    } else {
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#4285f4');
    headerRange.setFontColor('#ffffff');

    var statusById = data.questionStatusById || {};
    var row = [data.studentName || ''];
    for (var j = 0; j < questionOrder.length; j++) {
      var qId = questionOrder[j];
      row.push(statusById[qId] || 'אין מענה נכון');
    }
    row.push(data.score != null ? data.score : '');

    sheet.appendRow(row);
    sheet.autoResizeColumns(1, headers.length);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// נדרש כדי לאפשר CORS
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok', message: 'Service is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}
