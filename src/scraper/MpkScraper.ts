import { Cheerio, CheerioAPI } from "cheerio";
import type { AnyNode } from "domhandler";
import { Scraper } from ".";

interface TrafficIssue {
  lineNumbers: string[];
  trafficIssue: string;
  situationChange: string;
  addedDate: string;
  location: { lat: number; lng: number };
}

export class MpkScraper extends Scraper {
  constructor() {
    super("https://www.mpk.lodz.pl/rozklady/utrudnienia.jsp", "iso-8859-2");
  }

  public async getTraficIssues() {
    const $ = await this.readData();
    const rawData = $("#tJamsCntr");
    if (!rawData) {
      throw new Error("Error while getting traffic issues");
    }

    const table = rawData.find("#tJams");
    if (!table) {
      throw new Error("Could not find the traffic issues table");
    }

    const issuesFound: TrafficIssue[] = [];

    const primaryRows = table
      .find("tbody tr")
      .filter((_, el) => $(el).find("td.lines[rowspan]").length > 0);

    primaryRows.each((_, element) => {
      const row = $(element);

      if (row.find("th").length > 0) {
        return;
      }

      // catch lines
      const lineNumbers = this.getTrafficIssueLines($, row);

      // catch main info
      const tds = row.find("td");
      const trafficIssue = tds.eq(1).text().trim();
      const situationChange = tds.eq(2).text().trim();

      // catch lat and lng
      const onclick = tds.eq(3).find("a").eq(0).attr("onclick") ?? "";
      const mtchs = onclick.match(
        /showLoc\(\s*([+-]?\d+(?:\.\d+)?)\s*,\s*([+-]?\d+(?:\.\d+)?)\s*\)\s*;?/
      );
      const lng = mtchs ? parseFloat(mtchs[1]) : NaN;
      const lat = mtchs ? parseFloat(mtchs[2]) : NaN;

      // catch date
      const dateRow = row.next("tr");
      const dateText = dateRow.text();
      const m = dateText.match(
        /Dodano dnia\s+(\d{4}-\d{2}-\d{2})\s+o godzinie\s+(\d{2}:\d{2})/
      );
      const addedDate = m ? `${m[1]} ${m[2]}` : "";


      issuesFound.push({
        lineNumbers,
        trafficIssue,
        situationChange,
        addedDate,
        location: { lat, lng },
      });
    });
    return issuesFound;
  }

  private getTrafficIssueLines($: CheerioAPI, row: Cheerio<AnyNode>) {
    const linesCells = row.find("td.lines[rowspan]");
    if (linesCells.length > 0) {
      const lineNumbers: string[] = [];
      linesCells.contents().each((i, e) => {
        const item = $(e).text();
        if (item) {
          lineNumbers.push($(e).text());
        }
      });
      return lineNumbers;
    }
    return [];
  }
}
