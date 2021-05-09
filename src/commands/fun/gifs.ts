import { ApplicationCommandOptionTypes } from "../../../deps.ts";
import funGifs from "../../constants/gifs.ts";
import translate from "../../languages/translate.ts";
import { chooseRandom } from "../../utils/helpers.ts";
import { Command } from "../mod.ts";

const command: Command = {
  global: true,
  options: [
    {
      required: true,
      name: "GIF_TYPE_NAME",
      description: "GIF_TYPE_DESCRIPTION",
      type: ApplicationCommandOptionTypes.String,
    },
  ],
  execute: function (payload) {
    const arg = payload.data?.options?.[0];
    if (!arg) {
      return {
        content: translate(payload.guildId!, "BROKE_DISCORD"),
        embeds: [{ image: { url: "https://i.imgur.com/pEJNhgG.gif" } }],
      };
    }

    const gifs = funGifs.get(arg.value as string);
    if (!gifs) {
      return {
        content: translate(
          payload.guildId!,
          "GIFS_INVALID_TYPE",
          [...funGifs.keys()].join(", "),
        ),
      };
    }

    return {
      content: chooseRandom(gifs) ||
        "A random gif could not be selected. Blame wolf!",
    };
  },
};

export default command;
