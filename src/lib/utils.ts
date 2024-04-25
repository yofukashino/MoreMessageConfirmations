import { constants as DiscordConstants } from "replugged/common";
import Modules from "../lib/requiredModules";
import Types from "../types";

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
  return (Modules.PermissionStore.can(DiscordConstants.Permissions.MANAGE_MESSAGES, channel) ||
    Modules.PermissionStore.can(DiscordConstants.Permissions.MANAGE_CHANNELS, channel)) as boolean;
};
export const addWarningPopoutReason = async (
  caseValue: string,
  popouts: Set<Types.WarningPopoutReason>,
  args: [
    {
      channel: Types.Channel;
      content: string;
      openWarningPopout: (warningInfo: {
        analyticsType: string;
        animation: null | string;
        channel: Types.Channel;
        onCancel: () => void;
        onConfirm: () => void;
        popoutText?: {
          body: string;
          footer: string;
        };
      }) => void;
      uploads: unknown[];
    },
  ],
  res: Types.WarningPopout["applyChatRestrictions"],
): Promise<void> => {
  const [{ channel, content, openWarningPopout, uploads }] = args;
  const invites = getInvites(content);
  const mentions = getMentions(content);
  const links = getLinks(content);
  const customAnalyticsType = "dev.tharki.MoreMessageConfirmations";
  switch (caseValue) {
    case "invite": {
      const reason = new Promise<Types.WarningPopoutReason>((resolve) =>
        openWarningPopout({
          analyticsType: customAnalyticsType,
          animation: null,
          channel,
          onCancel: () => {
            resolve({
              valid: false,
              failureReason: "do_not_send_invite",
            });
          },
          onConfirm: () => {
            resolve({ valid: true });
          },
          popoutText: {
            body: `This will send invite links in chat. Do you want to continue?`,
            footer: `Amount of invite links: ${invites?.length}!`,
          },
        }),
      );
      popouts.add(await reason);
      break;
    }

    case "slowmode": {
      const reason = new Promise<Types.WarningPopoutReason>((resolve) =>
        openWarningPopout({
          analyticsType: customAnalyticsType,
          animation: null,
          channel,
          onCancel: () => {
            resolve({
              valid: false,
              failureReason: "do_not_slow_me",
            });
          },
          onConfirm: () => {
            resolve({ valid: true });
          },
          popoutText: {
            body: "This will put you in Slowmode. Do you want to continue?",
            footer: `Slowmode duration: ${toDaysMinutesSeconds(channel.rateLimitPerUser)}!`,
          },
        }),
      );
      popouts.add(await reason);
      break;
    }

    case "upload": {
      const reason = new Promise<Types.WarningPopoutReason>((resolve) =>
        openWarningPopout({
          analyticsType: customAnalyticsType,
          animation: null,
          channel,
          onCancel: () => {
            resolve({
              valid: false,
              failureReason: "do_not_upload",
            });
          },
          onConfirm: () => {
            resolve({ valid: true });
          },
          popoutText: {
            body: "This will upload the selected files. Do you want to continue?",
            footer: `Amount of files: ${uploads.length}!`,
          },
        }),
      );
      popouts.add(await reason);
      break;
    }
    case "mention": {
      const reason = new Promise<Types.WarningPopoutReason>((resolve) =>
        openWarningPopout({
          analyticsType: customAnalyticsType,
          animation: null,
          channel,
          onCancel: () => {
            resolve({
              valid: false,
              failureReason: "do_not_mention",
            });
          },
          onConfirm: () => {
            resolve({ valid: true });
          },
          popoutText: {
            body: `This will mention people. Do you want to continue?`,
            footer: `Amount of mentions: ${mentions?.length}!`,
          },
        }),
      );
      popouts.add(await reason);
      break;
    }

    case "link": {
      const reason = new Promise<Types.WarningPopoutReason>((resolve) =>
        openWarningPopout({
          analyticsType: customAnalyticsType,
          animation: null,
          channel,
          onCancel: () => {
            resolve({
              valid: false,
              failureReason: "do_not_send_link",
            });
          },
          onConfirm: () => {
            resolve({ valid: true });
          },
          popoutText: {
            body: `This will send links in chat. Do you want to continue?`,
            footer: `Amount of links: ${links?.length}!`,
          },
        }),
      );
      popouts.add(await reason);
      break;
    }
    default: {
      const reason = await res(...args);
      if (reason?.valid) popouts.add(reason);
      break;
    }
  }
};
export default {
  makeHumanReadable,
  toDaysMinutesSeconds,
  getMentions,
  getInvites,
  getLinks,
  canBypassSlowmode,
  addWarningPopoutReason,
};
