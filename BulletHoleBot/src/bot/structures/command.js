class Command {

  constructor(client, {
    name = null,
    description = "No description provided.",
    category = "Miscellaneous",
    usage = "No usage provided.",
    enabled = true,
    guildOnly = false,
    aliases = new Array(),
    nsfw = false
  }) {
    this.client = client;
    this.conf = { enabled, guildOnly, aliases, nsfw };
    this.help = { name, description, category, usage };
  }
}
module.exports = Command;