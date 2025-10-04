import express from "express";
import { MpkScraper } from "../scraper/mpk-scraper";

const router = express.Router();

const s = new MpkScraper();

router.get("/all", (req, res) => {
  (async () => {
    try {
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
  })();
});

export default router;
