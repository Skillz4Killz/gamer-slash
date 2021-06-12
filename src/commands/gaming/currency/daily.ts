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

    if (settings.dailyAt && settings.dailyAt > Date.now()) {
      return {
        content: translate(payload.guildId!, "DAILY_PATIENCE", humanizeMilliseconds(Date.now() - settings.dailyAt)),
      };
    }

    const total = (settings?.coins || 0) + 100;
    await database.upsert("users", id, {
      coins: total,
      dailyAt: Date.now() + Milliseconds.Day,
    });

    return { content: translate(payload.guildId!, "DAILY_RESPONSE", 100, total) };
  },
};

export default command;
