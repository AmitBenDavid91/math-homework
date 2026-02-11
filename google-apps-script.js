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
    var data = JSON.parse(e.postData.contents);

    // כותרות — ייווצרו רק פעם אחת
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'תאריך',
        'שם התלמיד',
        'ציון',
        'שאלות שגויות',
        'פירוט שגיאות'
      ]);
      // עיצוב כותרות
      var headerRange = sheet.getRange(1, 1, 1, 5);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }

    // כתיבת שורה חדשה
    sheet.appendRow([
      new Date().toLocaleString('he-IL'),
      data.studentName,
      data.score,
      data.wrongQuestions.length + ' מתוך ' + data.totalQuestions,
      data.wrongDetails.join(' | ')
    ]);

    // התאמת רוחב עמודות
    sheet.autoResizeColumns(1, 5);

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
