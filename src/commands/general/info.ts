import {
  ApplicationCommandInteractionDataOption,
  ApplicationCommandInteractionDataOptionWithValue,
  avatarURL,
  calculatePermissions,
  DiscordApplicationCommandOptionTypes,
  snowflakeToBigint,
} from "../../../deps.ts";
import translate from "../../languages/translate.ts";
import { Embed } from "../../utils/Embed.ts";
import { humanizeMilliseconds, toTitleCase } from "../../utils/helpers.ts";
import { snowflakeToTimestamp } from "../../utils/helpers.ts";
import { Command } from "../mod.ts";

const command: Command = {
  dev: true,
  global: false,
  options: [
    {
      required: false,
      name: "INFO_USER_NAME",
      description: "INFO_USER_DESCRIPTION",
      type: DiscordApplicationCommandOptionTypes.User,
    },
    {
      required: false,
      name: "INFO_SERVER_NAME",
      description: "INFO_SERVER_DESCRIPTION",
      type: DiscordApplicationCommandOptionTypes.String,
      choices: [
        {
          name: "server",
          value: "server",
        },
      ],
    },
  ],
  execute: function (payload) {
    const arg = payload.data?.options?.[0] as ApplicationCommandInteractionDataOptionWithValue;
    const userId = (arg?.value || "") as string;
    const targetMember = payload.data?.resolved?.members?.[userId] || payload.member;

    const targetUser = payload.data?.resolved?.users?.[userId] || payload.member?.user;

    if (!targetMember || !targetUser)
      return {
        content: translate(payload.guildId!, "BROKE_DISCORD"),
        embeds: [{ image: { url: "https://i.imgur.com/pEJNhgG.gif" } }],
      };

    const roles = targetMember.roles.map((id) => `<@&${id}>`).join(`, `);
    const createdAt = snowflakeToTimestamp(targetUser.id);
    const permissions = toTitleCase(
      calculatePermissions(targetMember.permissions).sort().join(", ").replaceAll("_", " ")
    );
    const avatarUrl = avatarURL(snowflakeToBigint(userId), snowflakeToBigint(targetUser.discriminator), {
      avatar: targetUser.avatar!,
      animated: true,
      size: 2048,
    });

    const embed = new Embed()
      .setAuthor(`${targetUser.username}#${targetUser.discriminator}`, avatarUrl)
      .setThumbnail(avatarUrl)
      .addField(
        translate(payload.guildId!, "NICKNAME"),
        targetMember.nick || `${targetUser.username}#${targetUser.discriminator}`,
        true
      )
      .addField(translate(payload.guildId!, "USER_ID"), userId, true)
      .addField(
        translate(payload.guildId!, "CREATED_ON"),
        [new Date(createdAt).toISOString().substr(0, 10), humanizeMilliseconds(Date.now() - createdAt)].join("\n"),
        true
      )
      .addField(
        translate(payload.guildId!, "JOINED_ON"),
        [
          new Date(targetMember.joinedAt).toISOString().substr(0, 10),
          humanizeMilliseconds(Date.now() - parseInt(targetMember.joinedAt)),
        ].join("\n"),
        true
      )
      .addField(
        translate(payload.guildId!, "PERMISSIONS"),
        permissions.includes("Administrator") ? translate(payload.guildId!, "INFO_ADMIN") : permissions
      );

    if (roles) embed.addField(translate(payload.guildId!, "ROLES"), roles);

    return { embeds: [embed] };
  },
};

export default command;
