import { TrafficIssueWithId } from "../scraper/mpk-scraper.js";
import db from "./db.js";

const insert = db.prepare(`
  INSERT OR IGNORE INTO issues (id, first_seen, last_seen, payload)
  VALUES (?, datetime('now'), datetime('now'), ?)
`);

const update = db.prepare(`
    UPDATE issues SET last_seen = datetime('now') WHERE id = ?
`);

export const dedupeIssues = (issues: TrafficIssueWithId[]) => {
  const tx = db.transaction((issues: TrafficIssueWithId[]) => {
    const newIssues: TrafficIssueWithId[] = [];
    for (const issue of issues) {
      const { id, ...rest } = issue;
      const result = insert.run(id, JSON.stringify(rest));
      update.run(id);

      if (result.changes > 0) {
        newIssues.push(issue);
      }
    }
    return newIssues;
  });

  const newIssues = tx(issues);

  return {
    total: issues.length,
    newCount: newIssues.length,
    skipped: issues.length - newIssues.length,
    newIssues,
  };
};
