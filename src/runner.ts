import { MpkScraper } from "./scraper/mpk-scraper";
import { dedupeIssues } from "./store/dedupe";

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
