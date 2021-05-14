import { ApplicationCommandOption, json, snowflakeToBigint, upsertSlashCommands } from "../../deps.ts";
import { commands } from "../commands/mod.ts";
import translate from "../languages/translate.ts";

export default async function redeploy(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization || authorization !== Deno.env.get("REDEPLOY_AUTHORIZATION")) {
    return json({ error: "Invalid authorization header." }, { status: 401 });
  }

  await updateGlobalCommands();
  await updateDevCommands();
  return json({ success: true });
}

export async function updateGlobalCommands() {
  // UPDATE GLOBAL COMMANDS
  await upsertSlashCommands(
    Object.entries(commands)
      // ONLY GLOBAL COMMANDS
      .filter(([_name, command]) => command?.global && !command.dev)
      .map(([name, command]) => {
        const description = translate("english", `${name.toUpperCase()}_DESCRIPTION`);

        return {
          name,
          description: command!.description || description || "No description available.",
          options: createOptions("english", command!.options),
        };
      })
  );
}

export async function updateGuildCommands(guildId: string) {
  // GUILD RELATED COMMANDS
  await upsertSlashCommands(
    Object.entries(commands)
      // ONLY GUILD COMMANDS
      .filter(([_name, command]) => command!.guild !== false && !command?.global && !command?.dev)
      .map(([name, command]) => {
        // USER OPTED TO USE BASIC VERSION ONLY
        if (command!.advanced === false) {
          return {
            name,
            description: command!.description || "No description available.",
            options: command!.options,
          };
        }

        // ADVANCED VERSION WILL ALLOW TRANSLATION
        const translatedName = translate(guildId, `${name.toUpperCase()}_NAME`);
        const translatedDescription = translate(guildId, `${name.toUpperCase()}_DESCRIPTION`);

        // console.log("dev", name, {
        //   name: (translatedName || name).toLowerCase(),
        //   description: translatedDescription || command!.description,
        //   options: createOptions(guildId, command!.options),
        // });
        // console.log(createOptions(guildId, command!.options));

        return {
          name: (translatedName || name).toLowerCase(),
          description: translatedDescription || command!.description,
          options: createOptions(guildId, command!.options),
        };
      }),
    snowflakeToBigint(guildId)
  );

  if (guildId === "800080308921696296") await updateDevCommands();
}

export async function updateDevCommands() {
  const guildId = "800080308921696296";
  const cmds = Object.entries(commands)
    // ONLY DEV COMMANDS
    .filter(([_name, command]) => command?.dev);

  if (!cmds.length) return;

  // DEV RELATED COMMANDS
  await upsertSlashCommands(
    cmds.map(([name, command]) => {
      const translatedName = translate(guildId, `${name.toUpperCase()}_NAME`);
      const translatedDescription = translate(guildId, `${name.toUpperCase()}_DESCRIPTION`);

      console.log("devd", name, {
        name: (translatedName || name).toLowerCase(),
        description: translatedDescription || command!.description,
        options: createOptions(guildId, command!.options),
      });
      console.log('devda', createOptions(guildId, command!.options));

      return {
        name: (translatedName || name).toLowerCase(),
        description: translatedDescription || command!.description,
        options: createOptions(guildId, command!.options),
      };
    }),
    snowflakeToBigint(guildId)
  );
}

function createOptions(guildId: string, options?: ApplicationCommandOption[]): ApplicationCommandOption[] | undefined {
  return options?.map((option) => {
    const optionName = translate(guildId, option.name);
    const optionDescription = translate(guildId, option.description);

    return {
      ...option,
      name: optionName,
      description: optionDescription || "No description available.",
      options: option.options ? createOptions(guildId, option.options) : undefined,
    };
  });
}
