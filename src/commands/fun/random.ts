import { ApplicationCommandOptionTypes } from "../../../deps.ts";
import translate from "../../languages/translate.ts";
import { Embed } from "../../utils/Embed.ts";
import { chooseRandom } from "../../utils/helpers.ts";
import { Command } from "../mod.ts";

const command: Command = {
  global: true,
  options: [
    {
      required: false,
      name: "RANDOM_NUMBER_TYPE_NAME",
      description: "RANDOM_NUMBER_TYPE_DESCRIPTION",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          required: false,
          name: "RANDOM_NUMBER_MIN_NAME",
          description: "RANDOM_NUMBER_MIN_DESCRIPTION",
          type: ApplicationCommandOptionTypes.Integer,
        },
        {
          required: false,
          name: "RANDOM_NUMBER_MAX_NAME",
          description: "RANDOM_NUMBER_MAX_DESCRIPTION",
          type: ApplicationCommandOptionTypes.Integer,
        },
      ],
    },
    {
      required: false,
      name: "RANDOM_8BALL_NAME",
      description: "RANDOM_8BALL_DESCRIPTION",
      type: ApplicationCommandOptionTypes.SubCommand,
      options: [
        {
          required: true,
          name: "RANDOM_8BALL_QUESTION_NAME",
          description: "RANDOM_8BALL_QUESTION_DESCRIPTION",
          type: ApplicationCommandOptionTypes.String,
        },
      ],
    },
    {
      required: false,
      name: "RANDOM_ADVICE_NAME",
      description: "RANDOM_ADVICE_DESCRIPTION",
      type: ApplicationCommandOptionTypes.SubCommand,
    },
  ],
  execute: function (payload) {
    const subcommand = payload.data?.options?.[0];
    if (!subcommand || subcommand.type !== ApplicationCommandOptionTypes.SubCommand) {
      return {
        content: translate(payload.guildId!, "BROKE_DISCORD"),
        embeds: [{ image: { url: "https://i.imgur.com/pEJNhgG.gif" } }],
      };
    }

    switch (subcommand.name) {
      case "number": {
        const minimum = subcommand.options?.find((o) => o.name === "minimum")?.value || 0;
        const maximum = subcommand.options?.find((o) => o.name === "maximum")?.value || 100;

        if (typeof maximum !== "number" || typeof minimum !== "number")
          return {
            content: translate(payload.guildId!, "BROKE_DISCORD"),
            embeds: [{ image: { url: "https://i.imgur.com/pEJNhgG.gif" } }],
          };

        return {
          content: Math.floor(Math.random() * (maximum - minimum) + minimum).toLocaleString("en-US"),
        };
      }
      case "8ball": {
        const question = subcommand.options?.[0].value;
        if (typeof question !== "string")
          return {
            content: translate(payload.guildId!, "BROKE_DISCORD"),
            embeds: [{ image: { url: "https://i.imgur.com/pEJNhgG.gif" } }],
          };

        const embed = new Embed().addField(
          translate(payload.guildId!, "ANSWER"),
          chooseRandom(translate(payload.guildId!, "RANDOM_8BALL_QUOTES").split("\n"))
        );

        if (question.length < 250) embed.setTitle(question);
        else embed.setDescription(question);

        return {
          embeds: [embed],
        };
      }
      default:
        // case "advice":
        return {
          content: chooseRandom(translate(payload.guildId!, "RANDOM_ADVICE_QUOTES").split("\n")),
        };
    }
  },
};

export default command;
