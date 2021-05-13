import languages from "./mod.ts";

/** This should hold the language names per guild id. <guildId, language> */
export const serverLanguages = new Map<string, string>();

export function translate(guildId: string, key: string, ...args: unknown[]): string {
  const language = serverLanguages.get(guildId) || "english";
  
  // DONT AWAIT THIS INTENTIONALLY!
  loadLanguage(guildId);
  
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

async function loadLanguage(guildId: string) {
  const settings = await fetch(`${Deno.env.get("DB_URL")}/v1/guilds/${guildId}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .catch(console.error);

  if (settings?.language && languages[settings.language]) serverLanguages.set(guildId, settings.language);
}

export default translate;
