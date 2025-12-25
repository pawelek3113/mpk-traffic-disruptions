import { MpkScraper } from "./scraper/mpk-scraper.js";
import { dedupeIssues } from "./store/dedupe.js";

export const runScrape = async () => {
  try {
    const scraper = new MpkScraper();
    const scraped = await scraper.getTraficIssues();

    if (!scraped) {
      return [];
    }

    const stats = dedupeIssues(scraped);
    return stats.newIssues;
  } catch (e) {
    console.error("Caught error", e);
  }
  return null;
};
