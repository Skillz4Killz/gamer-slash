import emojis from "../../constants/emojis.ts";
import translate from "../../languages/translate.ts";
import { Command } from "../mod.ts";

const command: Command = {
  global: true,
  execute: function (payload) {
    return {
      content: [
        `${emojis.coin} **${
          translate(
            payload.guildId!,
            "strings:INVITE_BOT",
          )
        }:** <https://discordapp.com/oauth2/authorize?client_id=270010330782892032&scope=bot+applications.commands&permissions=2111302911>`,
        "",
        `${emojis.bot} **${
          translate(
            payload.guildId!,
            "strings:NEED_SUPPORT",
          )
        }:** discord.gg/J4NqJ72`,
      ].join("\n"),
    };
  },
};

export default command;
