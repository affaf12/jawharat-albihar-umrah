/**
 * BACKEND FOR JAWHARAT AL-BIHAR WEBSITE — Google Apps Script
 * ------------------------------------------------------------
 * SETUP (one time, ~3 minutes):
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 * 2. Rename the first sheet tab (bottom-left) to exactly: Bookings
 * 3. In row 1, add these headers, one per column (A to G):
 *    Timestamp | Name | Phone | Package | Travellers | Message | Source
 * 4. In the Sheet menu, click Extensions > Apps Script.
 * 5. Delete any starter code there, and paste this ENTIRE file instead.
 * 6. Change ADMIN_KEY below to your own secret word (not "CHANGE_THIS_SECRET_KEY").
 * 7. Click Deploy > New deployment > select type "Web app".
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Click Deploy, then authorize it with your Google account when asked.
 * 8. Copy the "Web app URL" it gives you — you will paste this into
 *    index.html (CONFIG.SCRIPT_URL) and admin.html (CONFIG.SCRIPT_URL).
 * ------------------------------------------------------------
 */

const SHEET_NAME = "Bookings";
const ADMIN_KEY = "CHANGE_THIS_SECRET_KEY"; // <-- change this to your own secret word

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const p = e.parameter;
  sheet.appendRow([
    new Date(),
    p.name || "",
    p.phone || "",
    p.package || "",
    p.travellers || "",
    p.message || "",
    p.source || "form"
  ]);
  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  if (!e.parameter.key || e.parameter.key !== ADMIN_KEY) {
    return ContentService.createTextOutput(JSON.stringify({ error: "unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();
  const headers = data.shift();
  const rows = data.map(function (r) {
    const obj = {};
    headers.forEach(function (h, i) { obj[h] = r[i]; });
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(rows))
    .setMimeType(ContentService.MimeType.JSON);
}
