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
  private embedBuilder: EmbedBuilder;

  constructor() {
    const WEBHOOK_URL = z
      .string()
      .nonempty()
      .parse(process.env.DISCORD_WEBHOOK);

    this.webhookClient = new WebhookClient({
      url: WEBHOOK_URL,
    });

    this.embedBuilder = new EmbedBuilder();
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
    return this.embedBuilder
      .setTitle(title)
      .setDescription(description)
      .setFooter(footer)
      .setColor(color)
      .addFields(fields);
  }
}
