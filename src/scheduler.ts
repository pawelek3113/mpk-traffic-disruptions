import { APIEmbed, JSONEncodable } from "discord.js";
import cron from "node-cron";
import { DiscordClient } from "./discord";
import { runScrape } from "./runner";
import { TrafficIssueWithId } from "./scraper/mpk-scraper";

export class Scheduler {
  private discordClient: DiscordClient;
  constructor() {
    this.discordClient = new DiscordClient();
  }

  public start() {
    const run = async () => {
      try {
        const newIssues = await runScrape();
        if (Array.isArray(newIssues) && newIssues.length > 0) {
          this.postToDiscord(newIssues);
        }
      } catch (e) {
        console.error("Scheduler run failed", e);
      }
    };
    run();

    cron.schedule("*/15 0-6,8-23 * * *", run);
    cron.schedule("*/5 7 * * *", run);
  }

  private async postToDiscord(issues: TrafficIssueWithId[]) {
    let embeds: (APIEmbed | JSONEncodable<APIEmbed>)[] = [];
    for (let issue of issues) {
      const embed = this.discordClient.createEmbed(
        `Linie: ${issue.lineNumbers.join(" ")}`,
        `Utrudnienie: ${issue.trafficIssue}`,
        { text: issue.addedDate },
        "Red",
        [
          { name: "Zmiany", value: issue.situationChange },
          {
            name: "Lokalizacja",
            value: `https://www.google.com/maps/@${issue.location.lat},${issue.location.lng},12z`,
          },
        ]
      );
      embeds.push(embed);
    }
    this.discordClient.send("**UTRUDNIENIA**", embeds);
  }
}
