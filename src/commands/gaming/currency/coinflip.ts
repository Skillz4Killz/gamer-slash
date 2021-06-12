import { ApplicationCommandOptionTypes } from "../../../../deps.ts";
import emojis from "../../../constants/emojis.ts";
import translate from "../../../languages/translate.ts";
import database from "../../../utils/database.ts";
import { chooseRandom } from "../../../utils/helpers.ts";
import { Command } from "../../mod.ts";

const command: Command = {
  acknowledge: true,
  dev: true,
  options: [
    {
      required: false,
      name: "COINFLIP_SIDE_NAME",
      description: "COINFLIP_SIDE_DESCRIPTION",
      type: ApplicationCommandOptionTypes.String,
      choices: [
        { name: "COINFLIP_HEADS", value: "heads" },
        { name: "COINFLIP_TAILS", value: "tails" },
      ],
    },
    {
      required: false,
      name: "COINFLIP_AMOUNT_NAME",
      description: "COINFLIP_AMOUNT_DESCRIPTION",
      type: ApplicationCommandOptionTypes.Integer,
    },
  ],
  execute: async function (payload) {
    const sideArg = translate(payload.guildId!, "COINFLIP_SIDE_NAME").toLowerCase();
    const amountArg = translate(payload.guildId!, "COINFLIP_AMOUNT_NAME").toLowerCase();
    const choice = payload.data?.options?.find((opt) => opt.name.toLowerCase() === sideArg);
    const number = payload.data?.options?.find((opt) => opt.name.toLowerCase() === amountArg);

    // No requirements or cost just random flip
    if (!number || !choice || number.type !== ApplicationCommandOptionTypes.Integer) {
      return { content: chooseRandom(["<:heads:787887930534395914>", "<:tails:787887930299514901>"]) };
    }

    const amount = number.value < 10 && number.value > 0 ? number.value : 10;

    // Coinflip
    const coinflip = chooseRandom(["heads", "tails"]);
    const userID = payload.member?.user.id || payload.user!.id;

    const authorSettings = await database.findOne("users", userID);
    if (!authorSettings || authorSettings.coins < amount)
      return { content: translate(payload.guildId!, "COINFLIP_NOT_ENOUGH_COINS") };

    const win = choice.type === ApplicationCommandOptionTypes.String && choice.value === coinflip;
    const image =
      coinflip === "heads"
        ? `<:heads:787887930534395914> ${win ? emojis.success : ""}`
        : `<:tails:787887930299514901> ${win ? emojis.success : ""}`;

    await database.upsert("users", userID, {
      coins: win ? authorSettings.coins + amount : authorSettings.coins - amount,
    });

    return { content: image };
  },
};

export default command;
