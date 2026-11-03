# AWS Research Symposium on Future Agentic AI Systems and Applications

Website for the AWS Research Symposium on Future Agentic AI Systems and Applications, held on Tuesday, November 3, 2026, 9:00 AM–12:30 PM PT, in person at SJC38 (Room 01.101, 3075 Olcott St, Santa Clara, CA 95054) and online over Zoom.

The event is over. Registration is closed and the site is kept as a record of the program.

## Files

| File | What it is |
| --- | --- |
| `index.html` | Program page: themes, venue, and the schedule of invited talks with each talk's title, abstract and speaker bio. |
| `rsvp.html` | Registration page. Now shows a "registration is closed" notice; the form has been removed. |
| `apps-script/Code.gs` | The Google Apps Script that received registrations while they were open (see below). |

Each page is a single self-contained HTML file. Styles and fonts are embedded, so there is no build step and nothing else to install. Both pages carry `<meta name="robots" content="noindex, nofollow">` so search engines do not list them.

## How registration worked

1. A visitor filled in the form on `rsvp.html` (name, `@amazon.com` email, optional team, in person or Zoom, sessions of interest, notes).
2. The page checked the fields and sent them as JSON to a Google Apps Script web app.
3. `Code.gs` validated the request again (Amazon email, allowed attendance values, a hidden spam-trap field), took a lock so simultaneous submissions could not overwrite each other, and appended one row to the `RSVP` tab of a Google Sheet.

The Sheet and the script live in the webmaster's Google account. The web app deployment was archived after the event, so the old endpoint no longer accepts submissions.

## Updating the site

Edit `index.html` (or `rsvp.html`) and commit it. GitHub Pages republishes automatically within a minute or two; the **Actions** tab shows the `pages build and deployment` run. Hard-refresh the page (Cmd+Shift+R) to bypass the browser cache.

To add a talk, copy an existing `<li class="t-item">` block in the timeline and change the time, title, speaker, affiliation and the `In person` / `Remote` label. The abstract and bio go inside the `<details class="t-more">` block.

## Reusing it for another event

1. Change the title, date, time, venue and schedule in both pages.
2. Create a new Google Sheet, open **Extensions → Apps Script**, paste in `Code.gs`, and adjust `ALLOWED_ATTENDANCE` to match the options on the form.
3. **Deploy → New deployment → Web app**, with *Execute as: Me* and *Who has access: Anyone*. Copy the URL that ends in `/exec`.
4. Restore the registration form in `rsvp.html` from this repository's history and set `SUBMIT_URL` to that URL.

Webmaster: Aaron Chen
