import express from "express";
import { Scraper } from "../scraper";

const router = express.Router();

const s = new Scraper(
  "https://www.mpk.lodz.pl/rozklady/utrudnienia.jsp",
  "iso-8859-2"
);

router.get("/", (req, res) => {
  (async () => {
    try {
      const data = await s.readData("#tJamsCntr");

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
