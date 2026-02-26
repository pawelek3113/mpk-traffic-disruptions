import { APIEmbed, APIEmbedField, JSONEncodable } from "discord.js";
import { DiscordClient } from "./discord/discord.js";
import { runScrape } from "./runner.js";
import { TrafficIssueWithId } from "./scraper/mpk-scraper.js";
import { deleteIssues } from "./store/delete.js";

export class ScrapingUtils {
  static async run() {
    const discordClient = new DiscordClient();

    let newIssueIds: string[] = [];
    try {
      const newIssues = await runScrape();
      if (Array.isArray(newIssues) && newIssues.length > 0) {
        newIssueIds.push(...newIssues?.map((el) => el.id));
        ScrapingUtils.postToDiscord(newIssues, discordClient);
      }
      return newIssues;
    } catch (e) {
      console.error(
        "Scraping run method failed (incl. runScrape and postToDiscord)",
        e,
      );
      console.log("Deleting not posted issues from the database...");
      deleteIssues(newIssueIds);
    }
  }

  private static async postToDiscord(
    issues: TrafficIssueWithId[],
    discordClient: DiscordClient,
  ) {
    let embeds: (APIEmbed | JSONEncodable<APIEmbed>)[] = [];
    let linesLabel: string = "";

    for (let issue of issues) {
      const lines = issue.lineNumbers.join(" ");
      linesLabel = new String().concat(linesLabel, " ", lines);

      const locationField =
        issue.location.lat && issue.location.lng
          ? {
              name: "Lokalizacja",
              value: `https://www.google.com/maps/@${issue.location.lat},${issue.location.lng},6z`,
            }
          : null;

      const situationChangeField = {
        name: "Zmiany",
        value: issue.situationChange,
      };

      let embedFields: APIEmbedField[] = [situationChangeField];

      locationField && embedFields.push(locationField);

      const embed = discordClient.createEmbed(
        `Linie: ${lines}`,
        `Utrudnienie: ${issue.trafficIssue}`,
        { text: issue.addedDate },
        "Red",
        embedFields,
      );
      embeds.push(embed);
    }
    discordClient.send("UTRUDNIENIA na liniach:" + linesLabel, embeds);
  }
}
