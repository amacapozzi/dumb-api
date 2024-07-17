interface Author {
  name: string;
  url?: string;
  icon_url: string;
}

interface Fields {
  name: string;
  value: string;
  inline: boolean;
}

interface Props {
  title: string;
  author: Author;
  fields?: Fields[];
  description: string;
}

export class DiscordHelper {
  webhook: string;
  constructor(webhook: string) {
    this.webhook = webhook;
  }

  async createLog(data: Props) {
    const embed = {
      embeds: [
        {
          author: {
            ...data.author,
          },

          description: data.description,
        },
      ],
    };
    fetch(`${this.webhook}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    }).catch((err) => console.error(err));
  }
}
