import { ApplicationCommandOptionTypes } from "../../../deps.ts";
import translate from "../../languages/translate.ts";
// import { chooseRandom } from "../../utils/helpers.ts";
import { Command } from "../mod.ts";

const command: Command = {
  dev: true,
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
    console.log("options, random", payload.data?.options);
    // const subcommand = payload.data?.options?.[0];
    // if (!subcommand) {
    return {
      content: translate(payload.guildId!, "BROKE_DISCORD"),
      embeds: [{ image: { url: "https://i.imgur.com/pEJNhgG.gif" } }],
    };
    // }

    // switch(subcommand.value) {
    //   case "sub"
    // }
  },
};

export default command;
