import express from "express";
import { MpkScraper } from "../scraper/mpk-scraper";

const router = express.Router();

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
  const { runScrape } = await import("../runner");
  const newIssues = await runScrape();
  res.json({count: newIssues?.length, newIssues});
});

export default router;
