import crypto from "crypto";
import { TrafficIssue } from "./mpk-scraper.js";

const normalizeText = (s?: string) => {
  return (s || "").trim().replace(/\s+/g, " ").toLowerCase();
};

const normalizeObject = <T extends Record<string, any>>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, normalizeText(v)])
  ) as T;
};

const normalizeIssue = (issue: TrafficIssue) => {
  return normalizeObject({
    addedDate: issue.addedDate,
    trafficIssue: issue.trafficIssue,
    situationChange: issue.situationChange,
  });
};

export const generateTrafficIssueKey = (issue: TrafficIssue) => {
  const normalized = normalizeIssue(issue);

  const parts = [
    ...Object.values(normalized),
    ...issue.lineNumbers.map((line) => normalizeText(line)),
  ];

  return crypto.createHash("sha256").update(parts.join("_")).digest("hex");
};
