import {
  APIEmbed,
  APIEmbedField,
  ColorResolvable,
  EmbedBuilder,
  EmbedFooterOptions,
  JSONEncodable,
  WebhookClient,
} from "discord.js";
import z from "zod";

export class DiscordClient {
  private webhookClient: WebhookClient;

  constructor() {
    const WEBHOOK_URL = z
      .string()
      .nonempty()
      .parse(process.env.DISCORD_WEBHOOK);

    this.webhookClient = new WebhookClient({
      url: WEBHOOK_URL,
    });
  }

  public async send(
    content: string,
    embeds: (APIEmbed | JSONEncodable<APIEmbed>)[],
    username?: string,
    avatarURL?: string
  ) {
    await this.webhookClient.send({ content, embeds, username, avatarURL });
  }

  public createEmbed(
    title: string | null,
    description: string | null,
    footer: EmbedFooterOptions | null,
    color: ColorResolvable | null,
    fields: APIEmbedField[]
  ) {
    const embed = new EmbedBuilder();
    if (title) {
      embed.setTitle(title);
    }
    if (description) {
      embed.setDescription(description);
    }
    if (footer) {
      embed.setFooter(footer);
    }
    if (color) {
      embed.setColor(color);
    }
    if (fields && fields.length > 0) {
      embed.setFields(fields);
    }
    return embed;
  }
}
