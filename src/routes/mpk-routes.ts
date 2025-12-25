import express from "express";
import { MpkScraper } from "../scraper/mpk-scraper.js";
import { ScrapingUtils } from "../scrapingUtils.js";

const router = express.Router();

// TODO: fix?
router.get("/all", async (req, res) => {
  try {
    const s = new MpkScraper();
    const data = await s.getTraficIssues();

    res.set({
      "Content-Type": "application/json; charset=utf-8",
      "Accept-Charset": "utf-8",
    });

    res.send(data);
  } catch (error) {
    console.error("Error in route:", error);
    res.status(500).send("Error occurred");
  }
});

router.post("/run-scrape", async (req, res) => {
  const newIssues = await ScrapingUtils.run()
  res.json({count: newIssues?.length, newIssues});
});

export default router;
