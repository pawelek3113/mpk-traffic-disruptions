import {
  generateTrafficIssueKey,
  normalizeObject,
  normalizeText,
} from "../src/scraper/issue-key";
import { TrafficIssue } from "../src/scraper/mpk-scraper";
describe("Issue key", () => {
  let issue: TrafficIssue;
  let secondIssue: TrafficIssue;

  beforeEach(() => {
    issue = {
      lineNumbers: ["12", "18"],
      trafficIssue: "Example",
      addedDate: new Date().toISOString(),
      location: { lat: 12, lng: 12 },
      situationChange: "Example change",
    };

    secondIssue = {
      lineNumbers: ["57"],
      trafficIssue: "Examplee",
      addedDate: new Date("2025-12-02").toISOString(),
      location: { lat: 52, lng: 23 },
      situationChange: "Example changes",
    };
  });

  describe("Key generation", () => {
    it("should generate consistent hashes for the same issue object", () => {
      expect(generateTrafficIssueKey(issue)).toBe(
        generateTrafficIssueKey(issue)
      );
    });

    it("should generate different hashes for the different issue object", () => {
      expect(generateTrafficIssueKey(issue)).not.toBe(
        generateTrafficIssueKey(secondIssue)
      );
    });
  });

  describe("Normalization", () => {
    describe("Text normalization", () => {
      it("should remove beginning whitespaces from a text", () => {
        expect(normalizeText("	abc")).toBe("abc");
      });
      it("should replace any whitespaces from a text with space", () => {
        expect(normalizeText("  a	b c")).toBe("a b c");
      });

      it("should return empty string", () => {
        expect(normalizeText()).toBe("");
      });
    });

    describe("Object normalization", () => {
      let sampleObj: { value: string; secondValue: string };
      beforeEach(() => {
        sampleObj = {
          value: "	Test 	",
          secondValue: "	3  	Test  ",
        };
      });

      it("should normalize object entries", () => {
        const normalized = normalizeObject(sampleObj);
        Object.entries(normalized).forEach(([k, v]) => {
          expect(v).toMatch(/^\w[\w ]*\w$/);
        });
      });
    });
  });
});
