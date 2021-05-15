import { json } from "../../deps.ts";
import database from "../utils/database.ts";
import languages from "./mod.ts";

/** This should hold the language names per guild id. <guildId, language> */
export const serverLanguages = new Map<string, string>();

export function translate(guildId: string, key: string, ...args: unknown[]): string {
  const language = serverLanguages.get(guildId) || "english";

  let value = languages[language][key];

  if (Array.isArray(value)) return value.join("\n");

  if (typeof value === "function") return value(...args);
  // Was not able to be translated
  if (!value) {
    // Check if this key is available in english
    if (language !== "english") {
      value = languages.english[key];
    }

    // Still not found in english so default to using the KEY_ITSELF
    if (!value) value = key;
  }

  return value as string;
}

export async function loadLanguage(guildId: string) {
  const settings = await database.findOne("guilds", guildId);

  if (settings?.language && languages[settings.language]) serverLanguages.set(guildId, settings.language);
}

export async function loadAllLanguages() {
  // Load all translations for the guilds
  const guildSettings = await database.findAll("guilds");

  if (guildSettings) {
    for (const settings of guildSettings) {
      if (settings.language !== "english") serverLanguages.set(settings._id, settings.language);
    }
  }

  return json({ success: true });
}

export default translate;
