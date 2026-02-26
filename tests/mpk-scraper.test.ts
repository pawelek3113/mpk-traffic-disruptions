import * as cheerio from "cheerio";
import { MpkScraper } from "../src/scraper/mpk-scraper";

describe("Mpk Scraper", () => {
  describe("Data extraction", () => {
    it("should correctly get traffic issues' info from fetched data", async () => {
      const scraper = new MpkScraper();

      const mockHtml = `
        <div id="tJamsCntr">
          <table id="tJams">
            <tbody>
              <tr>
                <td class="lines" rowspan="1">96</td>
                <td><p>Tram derailed magically in the Węglowa street.</p></td>
                <td><p>Now it's fixed and trams are delayed, we're sorry for that.</p></td>
                <td><a onclick="showLoc(51.75, 19.45)">Location</a></td>
              </tr>
              <tr>
                <td colspan="4">Dodano dnia 2005-04-27 o godzinie 21:37</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
      const $ = cheerio.load(mockHtml);

      jest.spyOn(scraper as any, "readData").mockResolvedValue($);

      const issues = await scraper.getTrafficIssues();

      expect(issues).not.toBe(null);
      expect(issues).toHaveLength(1);
      expect(issues![0].lineNumbers).toContain("96");
      expect(issues![0].trafficIssue).toBe(
        "Tram derailed magically in the Węglowa street.",
      );
    });
  });
});
