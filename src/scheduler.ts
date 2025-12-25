import cron from "node-cron";
import { ScrapingUtils } from "./scrapingUtils";

export class Scheduler {
  public start() {
    cron.schedule("*/15 0-6,8-23 * * *", ScrapingUtils.run);
    cron.schedule("*/5 7 * * *", ScrapingUtils.run);
  }
}
