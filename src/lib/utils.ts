import { constants as DiscordConstants } from "replugged/common";
import { PermissionStore } from "../lib/requiredModules";

export const makeHumanReadable = (num: number, singular: string): string => {
  return num > 0 ? `${num} ${num === 1 ? singular : `${singular}s`}, ` : "";
};
export const toDaysMinutesSeconds = (totalSeconds: number): string => {
  if (!totalSeconds) return "0 seconds";
  const seconds = Math.floor(totalSeconds % 60);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const secondsStr = makeHumanReadable(seconds, "second");
  const minutesStr = makeHumanReadable(minutes, "minute");
  const hoursStr = makeHumanReadable(hours, "hour");
  const daysStr = makeHumanReadable(days, "day");
  return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.replace(/,\s*$/, "");
};
export const getMentions = (text): string[] => {
  return [...text.matchAll(/<@!?(\d+)>/g)].map((m) => m[1]);
};
export const getInvites = (text): string[] => {
  return [
    ...text.matchAll(
      /(?:https:\/\/)?(?:www\.)?(?:(?:discord(?:app)?)?\.com\/invite|(?:discord(?:app)?)?\.gg)\/[^ ]+/gm,
    ),
  ].map((m) => m[0]);
};
export const getLinks = (text): string[] => {
  return [
    ...text.matchAll(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/gm,
    ),
  ].map((m) => m[0]);
};
export const canBypassSlowmode = (channel): boolean => {
  return (PermissionStore.can(DiscordConstants.Permissions.MANAGE_MESSAGES, channel) ||
    PermissionStore.can(DiscordConstants.Permissions.MANAGE_CHANNELS, channel)) as boolean;
};

export default {
  makeHumanReadable,
  toDaysMinutesSeconds,
  getMentions,
  getInvites,
  getLinks,
  canBypassSlowmode,
};
