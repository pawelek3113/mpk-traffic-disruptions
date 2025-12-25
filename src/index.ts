import express from "express";
import scraperRoutes from "./routes/mpk-routes.js";
import { Scheduler } from "./scheduler.js";

const app = express();
const port = 3000;

app.use(scraperRoutes);

app.listen(port, () => {
  console.log(`Running at: http://localhost:${port}`);
  Scheduler.start();
});
