import { Milliseconds } from "../constants/milliseconds.ts";

export function chooseRandom<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)]!;
}

export function snowflakeToTimestamp(id: string) {
  return Math.floor(Number(id) / 4194304) + 1420070400000;
}

export function toTitleCase(text: string) {
  return text
    .split(" ")
    .map((word) => (word[0] ? `${word[0].toUpperCase()}${word.substring(1).toLowerCase()}` : word))
    .join(" ");
}

/** This function should be used when you want to convert milliseconds to a human readable format like 1d5h. */
export function humanizeMilliseconds(milliseconds: number) {
  const years = Math.floor(milliseconds / Milliseconds.Year);
  const months = Math.floor((milliseconds % Milliseconds.Year) / Milliseconds.Month);
  const weeks = Math.floor(((milliseconds % Milliseconds.Year) % Milliseconds.Month) / Milliseconds.Week);
  const days = Math.floor(
    (((milliseconds % Milliseconds.Year) % Milliseconds.Month) % Milliseconds.Week) / Milliseconds.Day
  );
  const hours = Math.floor(
    ((((milliseconds % Milliseconds.Year) % Milliseconds.Month) % Milliseconds.Week) % Milliseconds.Day) /
      Milliseconds.Hour
  );
  const minutes = Math.floor(
    (((((milliseconds % Milliseconds.Year) % Milliseconds.Month) % Milliseconds.Week) % Milliseconds.Day) %
      Milliseconds.Hour) /
      Milliseconds.Minute
  );
  const seconds = Math.floor(
    ((((((milliseconds % Milliseconds.Year) % Milliseconds.Month) % Milliseconds.Week) % Milliseconds.Day) %
      Milliseconds.Hour) %
      Milliseconds.Minute) /
      Milliseconds.Second
  );

  const YearString = years ? `${years}y ` : "";
  const monthString = months ? `${months}mo ` : "";
  const weekString = weeks ? `${weeks}w ` : "";
  const dayString = days ? `${days}d ` : "";
  const hourString = hours ? `${hours}h ` : "";
  const minuteString = minutes ? `${minutes}m ` : "";
  const secondString = seconds ? `${seconds}s ` : "";

  return (
    `${YearString}${monthString}${weekString}${dayString}${hourString}${minuteString}${secondString}`.trimEnd() || "1s"
  );
}
