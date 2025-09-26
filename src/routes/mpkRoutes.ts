import express from "express";
import { Scraper } from "../scraper";
import { MpkScraper } from "../scraper/MpkScraper";

const router = express.Router();

const s = new MpkScraper()

router.get("/", (req, res) => {
  (async () => {
    try {
      const data = await s.getTraficIssues()

      res.set({
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Charset": "utf-8",
      });

      res.send(data);
    } catch (error) {
      console.error("Error in route:", error);
      res.status(500).send("Error occurred");
    }
  })();
});

export default router;
