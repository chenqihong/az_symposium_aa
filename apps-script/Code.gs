/**
 * RSVP receiver for the AgentCore Science Fall Research Symposium.
 *
 * Setup: open the Google Sheet, Extensions > Apps Script, replace everything
 * in Code.gs with this file, then Deploy > New deployment > Web app
 * (Execute as: Me, Who has access: Anyone).
 *
 * Each registration is appended as one row to the "RSVP" tab.
 */

const SHEET_NAME = "RSVP";
const HEADERS = ["Submitted at", "Name", "Email", "Team", "Attendance", "Sessions of interest", "Notes"];
const ALLOWED_ATTENDANCE = ["In person: SJC38", "In person: SEA Nitro North", "In person: JFK25", "Zoom"];
const MAX_LEN = 1000;

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    // Spam trap: real people never fill in the hidden "website" field.
    // Pretend it worked so bots don't retry.
    if (data.website) return json_({ ok: true });

    const name = clean_(data.name);
    const email = clean_(data.email).toLowerCase();
    const attendance = clean_(data.attendance);
    const team = clean_(data.team);
    const notes = clean_(data.notes);
    const interests = Array.isArray(data.interests) ? data.interests.map(clean_).join(", ") : "";

    if (!name) return json_({ ok: false, error: "missing name" });
    if (!/^[^\s@]+@amazon\.com$/.test(email)) return json_({ ok: false, error: "invalid email" });
    if (ALLOWED_ATTENDANCE.indexOf(attendance) === -1) return json_({ ok: false, error: "invalid attendance" });

    // Two people can submit at the same moment. The lock makes their writes
    // take turns so neither row is lost or overwritten.
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = getSheet_();
      sheet.appendRow([new Date(), name, email, team, attendance, interests, notes]);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: "server error" });
  }
}

// Lets you open the web app URL in a browser to check it is deployed.
function doGet() {
  return json_({ ok: true, message: "RSVP endpoint is running" });
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Trims, caps length, and stops a value starting with = + - @ from being
// treated as a spreadsheet formula.
function clean_(v) {
  let s = String(v == null ? "" : v).trim().slice(0, MAX_LEN);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
