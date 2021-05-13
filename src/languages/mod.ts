import english from "./en_US.ts";
import german from "./de_DE.ts";

const languages: Record<string, Language> = {
  english,
  german,
};

export default languages;

export type Language = Record<
  string,
  // deno-lint-ignore no-explicit-any
  string | string[] | ((...args: any[]) => string)
>;
