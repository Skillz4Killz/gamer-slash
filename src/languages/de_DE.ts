import { Language } from "./mod.ts";

const german: Language = {
  // COMMON STRINGS

  MISSING_MEMBER: "Es wurde kein Nutzer gefunden.",
  MISSING_PERM_LEVEL:
    "Du hast nicht die nötigen Berechtigungen für diesen Befehl.",
  BROKE_DISCORD:
    "Du hast Discord kaputt gemacht! Glückwunsch! <:blamewolf:814955268123000832>",

  // COMMANDS STRINGS

  // Avatar Command
  AVATAR_NAME: "avatar",
  AVATAR_DESCRIPTION:
    "🖼️ Zeigt den Avatar eines Benutzers oder von dir selbst an.",
  AVATAR_USER_NAME: "Beutzer",
  AVATAR_USER_DESCRIPTION:
    "Erwähnen einen Benutzer mit @name um den Avatar anzuzeigen.",
  AVATAR_DOWNLOAD_LINK: "🔗 Download Link",

  // Gifs Command
  GIFS_NAME: "gifs",
  GIFS_DESCRIPTION: "Schickt ein zufälliges GIF.",
  GIF_TYPE_NAME: "keyword",
  GIF_TYPE_DESCRIPTION:
    "Ein keyword für das GIF, z. B. hug, kiss, cuddle, etc...",
  GIFS_INVALID_TYPE: (types: string) =>
    `Diese Art GIF unterstützen wir nicht. Gültige keywords sind: **${types}**`,

  // Invite Command
  INVITE_NAME: "invite",
  INVITE_DESCRIPTION:
    "🔗 Lade den Bot auf deinen Server ein oder hole dir Hilfe vom support Server.",
  INVITE_BOT: "Lade den Bot ein.",
  INVITE_NEED_SUPPORT: "Brauchst du Hilfe?",

  // Language Command
  LANGUAGE_NAME: "Sprache",
  LANGUAGE_DESCRIPTION: "⚙️ Ändere die Sprache des Bots.",
  LANGUAGE_KEY_NAME: "name",
  LANGUAGE_KEY_DESCRIPTION: "Auf welche Sprache möchtest du wechseln?",
  LANGUAGE_MISSING_KEY: "Es wurde keine Ausgabesprache angegeben.",
  LANGUAGE_INVALID_KEY: (languages: string[]) =>
    `Ich konnte die Sprache nicht finden. Gültige Sprachen sind: ${
      languages.join(" ")
    }`,
  LANGUAGE_UPDATED: (language: string) =>
    `Die Sprache wurde auf ${language} geändert!`,

  // Ping Command
  PING_NAME: "ping",
  PING_DESCRIPTION: "🏓 Prüfe die Reaktionszeit des Bots und ob er online ist.",
  PING_RESPONSE: "🏓 Pong! Ich bin online! :clock10:",
};

export default german;
