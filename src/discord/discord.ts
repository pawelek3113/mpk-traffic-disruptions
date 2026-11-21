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
  private webhookClients: WebhookClient[];

  constructor() {
    const urls = z
          .string()
          .nonempty("DISCORD_WEBHOOKS must not be empty")
          .transform((val) =>
            val
              .split(",")
              .map((u) => u.trim())
              .filter(Boolean),
          )
          .pipe(z.array(z.url()).min(1))
          .parse(process.env.DISCORD_WEBHOOKS);
    
        this.webhookClients = urls.map((url) => new WebhookClient({ url }));
  }

  public async send(
    content: string,
    embeds: (APIEmbed | JSONEncodable<APIEmbed>)[],
    username?: string,
    avatarURL?: string
  ) {
    const results = await Promise.allSettled(
          this.webhookClients.map((client) =>
            client.send({ content, embeds, username, avatarURL }),
          ),
        );

        const failures = results.filter((r) => r.status === "rejected");
        for (const failure of failures) {
          console.error("Failed to send Discord webhook:", failure.reason);
        }

        if (failures.length === results.length) {
          throw new Error("All Discord webhooks failed to send");
        }
  }

  // TODO: refactor, use typed options object here to provide optional attributes
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
