import { Milliseconds } from "../../../constants/milliseconds.ts";
import translate from "../../../languages/translate.ts";
import database from "../../../utils/database.ts";
import { humanizeMilliseconds } from "../../../utils/helpers.ts";
import { Command } from "../../mod.ts";

const command: Command = {
  acknowledge: true,
  dev: true,
  execute: async function (payload) {
    const id = payload.member?.user.id || payload.user!.id;
    const settings = await database.findOne("users", id);

    if (settings.hourlyAt && settings.hourlyAt > Date.now()) {
      return {
        content: translate(payload.guildId!, "HOURLY_PATIENCE", humanizeMilliseconds(Date.now() - settings.hourlyAt)),
      };
    }

    const total = (settings?.coins || 0) + 20;
    await database.upsert("users", id, {
      coins: total,
      hourlyAt: Date.now() + Milliseconds.Hour,
    });

    return { content: translate(payload.guildId!, "HOURLY_RESPONSE", 20, total) };
  },
};

export default command;
