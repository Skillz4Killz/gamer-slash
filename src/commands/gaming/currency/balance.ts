import { ApplicationCommandOptionTypes } from "../../../../deps.ts";
import emojis from "../../../constants/emojis.ts";
import translate from "../../../languages/translate.ts";
import database from "../../../utils/database.ts";
import { Command } from "../../mod.ts";

const command: Command = {
  dev: true,
  options: [
    {
      required: false,
      name: "BALANCE_USER_NAME",
      description: "BALANCE_USER_DESCRIPTION",
      type: ApplicationCommandOptionTypes.User,
    },
  ],
  execute: async function (payload) {
    const arg = payload.data?.options?.[0];
    if (arg && arg?.type !== ApplicationCommandOptionTypes.User)
      return {
        content: translate(payload.guildId!, "BROKE_DISCORD"),
        embeds: [{ image: { url: "https://i.imgur.com/pEJNhgG.gif" } }],
      };

    const userId = (arg?.value || "") as string;
    const targetUser = payload.data?.resolved?.users?.[userId] || payload.member?.user || payload.user!;

    const settings = await database.findOne("users", targetUser.id);
    let amount = settings?.coins || 0;

    const marriage = await database.findOne("marriages", targetUser.id);
    if (marriage && marriage.accepted) {
      const spouse = await database.findOne("users", marriage.spouseID);
      if (spouse) amount += spouse.coins;
    }

    return { content: `${amount.toLocaleString("en-US")} ${emojis.coin}` };
  },
};

export default command;
