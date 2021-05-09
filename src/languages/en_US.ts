import { Language } from "./mod.ts";

const english: Language = {
  // COMMON STRINGS

  MISSING_MEMBER: "No member was found.",
  MISSING_PERM_LEVEL:
    "You do not have the necessary permissions to use this command.",
  BROKE_DISCORD: "You just broke Discord! Congrats!",

  // COMMANDS STRINGS

  // Avatar Command
  AVATAR_NAME: "avatar",
  AVATAR_DESCRIPTION: "🖼️ Shows the avatar of a user or yourself.",
  AVATAR_USER_NAME: "user",
  AVATAR_USER_DESCRIPTION: "Provide a @user to view their avatar.",
  AVATAR_DOWNLOAD_LINK: "🔗 Download Link",

  // Gifs Command
  GIFS_NAME: "gifs",
  GIFS_DESCRIPTION: "Sends a random gif.",
  GIF_TYPE_NAME: "type",
  GIF_TYPE_DESCRIPTION: "The type of gif such as hug, kiss, cuddle, etc...",
  GIFS_INVALID_TYPE: (types: string) =>
    `This type of gif is not available. The valid types are: **${types}**`,

  // Invite Command
  INVITE_NAME: "invite",
  INVITE_DESCRIPTION:
    "🔗 Invite the bot to your server or get help in the support server.",
  INVITE_BOT: "Invite The Bot",
  INVITE_NEED_SUPPORT: "Need Help?",

  // Language Command
  LANGUAGE_NAME: "language",
  LANGUAGE_DESCRIPTION: "⚙️ Change the bots language.",
  LANGUAGE_KEY_NAME: "name",
  LANGUAGE_KEY_DESCRIPTION: "What language would you like to set?",
  LANGUAGE_MISSING_KEY: "No language was provided.",
  LANGUAGE_INVALID_KEY: (languages: string[]) =>
    `I could not find a language with that name. Valid languages are: ${
      languages.join(" ")
    }`,
  LANGUAGE_UPDATED: (language: string) =>
    `The language has been updated to ${language}`,

  // Ping Command
  PING_NAME: "ping",
  PING_DESCRIPTION: "🏓 Check whether the bot is online and responsive.",
  PING_RESPONSE: "🏓 Pong! I am online and responsive! :clock10:",

  // Info Command
  INFO_USER_NAME: "user",
  INFO_USER_DESCRIPTION: "Get the info of an user",
  INFO_SERVER_NAME: "server",
  INFO_SERVER_DESCRIPTION: "Get the info of this server"
};

export default english;
