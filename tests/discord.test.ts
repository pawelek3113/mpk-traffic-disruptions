jest.mock("discord.js", () => ({
  ...jest.requireActual("discord.js"),
  WebhookClient: jest.fn().mockImplementation(() => ({
    send: jest.fn().mockResolvedValue(undefined),
  })),
}));

import { APIEmbedField, Colors, EmbedBuilder } from "discord.js";
import { DiscordClient } from "../src/discord/discord";

describe("DiscordClient", () => {
  const originalWebhook = process.env.DISCORD_WEBHOOK;

  afterEach(() => {
    process.env.DISCORD_WEBHOOK = originalWebhook;
    jest.clearAllMocks();
  });

  describe("Creation", () => {
    it("should throw an error when url's not provided", () => {
      delete process.env.DISCORD_WEBHOOK;

      expect(() => {
        new DiscordClient();
      }).toThrow();
    });

    it("should throw an error when url's empty", () => {
      process.env.DISCORD_WEBHOOK = "";

      expect(() => {
        new DiscordClient();
      }).toThrow("DISCORD_WEBHOOK URL must not be empty");
    });
  });

  describe("Functionality", () => {
    let dcc: DiscordClient;

    beforeEach(() => {
      process.env.DISCORD_WEBHOOK = "https://discord.com/api/webhooks/123/abc";
      dcc = new DiscordClient();
    });

    describe("Embeds", () => {
      it("should create an embed with a title", () => {
        const title = "Example title";
        const embed = dcc.createEmbed(title, null, null, null, []);

        expect(embed).toBeInstanceOf(EmbedBuilder);
        expect(embed.data.title).toBe(title);
      });

      it("should create an embed with a description", () => {
        const description = "Example description";
        const embed = dcc.createEmbed(null, description, null, null, []);

        expect(embed).toBeInstanceOf(EmbedBuilder);
        expect(embed.data.description).toBe(description);
      });

      it("should create an embed with a footer", () => {
        const footerText = "Example footer";
        const embed = dcc.createEmbed(
          null,
          null,
          { text: footerText },
          null,
          []
        );

        expect(embed).toBeInstanceOf(EmbedBuilder);
        expect(embed.data?.footer?.text).toBe(footerText);
      });

      it("should create an embed with a color", () => {
        const color = Colors.Fuchsia;
        const embed = dcc.createEmbed(null, null, null, color, []);

        expect(embed).toBeInstanceOf(EmbedBuilder);
        expect(embed.data.color).toEqual(color);
      });

      it("should create an embed with fields", () => {
        const fields: APIEmbedField[] = [
          { name: "example", value: "example value" },
          { name: "example 2", value: "second example value" },
        ];
        const embed = dcc.createEmbed(null, null, null, null, fields);

        expect(embed).toBeInstanceOf(EmbedBuilder);
        expect(embed.data.fields).toEqual(fields);
      });
    });

    describe("Sending", () => {
      it("should send a message to a channel", async () => {
        const embed = dcc.createEmbed(null, null, null, null, []);
        expect(embed).toBeInstanceOf(EmbedBuilder);

        await expect(dcc.send("content", [embed])).resolves.not.toThrow();
      });
    });
  });
});
