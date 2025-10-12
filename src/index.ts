import express from "express";
import scraperRoutes from "./routes/mpk-routes";
import { Scheduler } from "./scheduler";

const app = express();
const port = 4269;

app.use(scraperRoutes);

app.listen(4269, () => {
  console.log(`Running at: http://localhost:${port}`);
  const scheduler = new Scheduler();
  scheduler.start();
});
