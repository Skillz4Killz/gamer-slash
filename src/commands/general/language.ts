import { ApplicationCommandOptionTypes, validatePermissions } from "../../../deps.ts";
import { Command } from "../mod.ts";
import languages from "../../languages/mod.ts";
import { serverLanguages, translate } from "../../languages/translate.ts";
import { updateGuildCommands } from "../../utils/redeploy.ts";
import database from "../../utils/database.ts";

const command: Command = {
  dev: true,
  advanced: false,
  options: [
    {
      name: "english",
      description: "🇺🇸 English (Default Language)",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
    {
      name: "german",
      description: "🇩🇪 German",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
  ],
  execute: function (payload) {
    const subcommand = payload.data?.options?.[0];
    const value = subcommand?.name || "";
    if (!value) {
      return { content: translate(payload.guildId!, "LANGUAGE_MISSING_KEY") };
    }

    if (!languages[value]) {
      return {
        content: translate(payload.guildId!, "LANGUAGE_INVALID_KEY", Object.keys(languages)),
      };
    }

    // Make sure the user has valid permissions to use this command
    if (!validatePermissions(payload.member!.permissions, ["ADMINISTRATOR"]))
      return {
        content: translate(payload.guildId!, "USER_NOT_ADMIN"),
      };

    // EDIT CACHE BEFORE UPDATING COMMANDS
    serverLanguages.set(payload.guildId!, value);

    // Set the language to the commands on this server.
    updateGuildCommands(payload.guildId!);

    // Update it in the database
    database.upsert("guilds", payload.guildId!, { language: value });

    return {
      content: translate(payload.guildId!, "LANGUAGE_UPDATED", value),
    };
  },
};

export default command;
