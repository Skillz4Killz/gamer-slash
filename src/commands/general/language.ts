import { ApplicationCommandOptionTypes, validatePermissions } from "../../../deps.ts";
import { Command } from "../mod.ts";
import languages from "../../languages/mod.ts";
import { serverLanguages, translate } from "../../languages/translate.ts";
import { updateGuildCommands } from "../../utils/redeploy.ts";

const command: Command = {
  dev: true,
  global: true,
  options: [
    {
      name: "english",
      description: ":flag_us: English (Default Language)",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
    {
      name: "german",
      description: ":flag_de: German",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
  ],
  execute: async function (payload) {
    const arg = payload.data?.options?.[0];
    const value = (arg?.value || "") as string;
    if (!value) {
      return { content: translate(payload.guildId!, "LANGUAGE_MISSING_KEY") };
    }

    if (!languages[value]) {
      return {
        content: translate(payload.guildId!, "LANGUAGE_INVALID_KEY", Object.keys(languages)),
      };
    }

    // Make sure the user has valid permissions to use this command
    if (validatePermissions(payload.member!.permissions, ["ADMINISTRATOR"]))
      return {
        content: translate(payload.guildId!, "USER_NOT_ADMIN"),
      };

    console.log(`${Deno.env.get("DB_URL")}/v1/guilds/${payload.guildId}`);

    await Promise.all([
      // Set the language to the commands on this server.
      updateGuildCommands(payload.guildId!),
      // Update it in the database
      fetch(`${Deno.env.get("DB_URL")}/v1/guilds/${payload.guildId}`, {
        method: "PUT",
        body: JSON.stringify({ language: value, _id: payload.guildId }),
      }),
    ]).catch(console.error);

    serverLanguages.set(payload.guildId!, value);

    return {
      content: translate(payload.guildId!, "LANGUAGE_UPDATED", value),
    };
  },
};

export default command;
