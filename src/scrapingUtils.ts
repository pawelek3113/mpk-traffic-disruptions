import { APIEmbed, JSONEncodable } from "discord.js";
import { DiscordClient } from "./discord/discord.js";
import { runScrape } from "./runner.js";
import { TrafficIssueWithId } from "./scraper/mpk-scraper.js";

export class ScrapingUtils {
  static async run() {
    const discordClient = new DiscordClient();
    try {
      // TODO: fix - make it transactional, that said do not add to the database until its finished all the way through
      const newIssues = await runScrape();
      if (Array.isArray(newIssues) && newIssues.length > 0) {
        ScrapingUtils.postToDiscord(newIssues, discordClient);
      }
      return newIssues;
    } catch (e) {
      console.error("Scraping run method failed", e);
    }
  }

  private static async postToDiscord(
    issues: TrafficIssueWithId[],
    discordClient: DiscordClient
  ) {
    let embeds: (APIEmbed | JSONEncodable<APIEmbed>)[] = [];
    let linesLabel: string = "  Linie: ";

    for (let issue of issues) {
      const lines = issue.lineNumbers.join(" ");
      linesLabel = new String().concat(linesLabel, lines);

      const embed = discordClient.createEmbed(
        `Linie: ${lines}`,
        `Utrudnienie: ${issue.trafficIssue}`,
        { text: issue.addedDate },
        "Red",
        [
          { name: "Zmiany", value: issue.situationChange },
          {
            // TODO: fix location nulls
            name: "Lokalizacja",
            value: `https://www.google.com/maps/@${issue.location.lat},${issue.location.lng},6z`,
          },
        ]
      );
      embeds.push(embed);
    }
    discordClient.send("**UTRUDNIENIA**" + linesLabel, embeds);
  }
}
