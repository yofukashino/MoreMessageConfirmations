import { webpack } from "replugged";
import { PluginInjector, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import { WarningPopout } from "../lib/requiredModules";
import * as Utils from "../lib/utils";
import * as Types from "../types";
const newPromise = (caseValue, args, res): Promise<Types.openWarningPopout> => {
  const [{ channel, content, openWarningPopout, uploads }] = args;
  const invites = Utils.getInvites(content);
  const mentions = Utils.getMentions(content);
  const links = Utils.getLinks(content);
  const customAnalyticsType = "dev.tharki.DiscordBypasses";
  switch (caseValue) {
    case "invite":
      return new Promise((resolve) =>
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
    case "slowmode":
      return new Promise((resolve) =>
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
            footer: `Slowmode duration: ${Utils.toDaysMinutesSeconds(channel.rateLimitPerUser)}!`,
          },
        }),
      );
    case "upload":
      return new Promise((resolve) =>
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
    case "mention":
      return new Promise((resolve) =>
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
    case "link":
      return new Promise((resolve) =>
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
    default:
      return res(...args) as Promise<Types.openWarningPopout>;
  }
};
const checkConditions = async (args, res, _instance): Promise<Types.openWarningPopout> => {
  const [{ channel, content, uploads }] = args;
  const invites = Utils.getInvites(content);
  const mentions = Utils.getMentions(content);
  const links = Utils.getLinks(content);
  const popouts = new Set();
  if (
    SettingValues.get("inviteConfirmation", defaultSettings.inviteConfirmation) &&
    !channel.isDM() &&
    !channel.isGroupDM() &&
    Math.floor(SettingValues.get("inviteTrigger", defaultSettings.inviteTrigger)) <= invites?.length
  )
    popouts.add(await newPromise("invite", args, res));

  if (
    SettingValues.get("slowmodeConfirmation", defaultSettings.slowmodeConfirmation) &&
    !Utils.canBypassSlowmode(channel) &&
    Math.floor(SettingValues.get("slowmodeTrigger", defaultSettings.slowmodeTrigger)) <=
      channel?.rateLimitPerUser
  )
    popouts.add(await newPromise("slowmode", args, res));

  if (
    SettingValues.get("uploadConfirmation", defaultSettings.uploadConfirmation) &&
    Math.floor(SettingValues.get("uploadTrigger", defaultSettings.uploadTrigger)) <= uploads?.length
  )
    popouts.add(await newPromise("upload", args, res));

  if (
    SettingValues.get("mentionConfirmation", defaultSettings.mentionConfirmation) &&
    Math.floor(SettingValues.get("mentionTrigger", defaultSettings.mentionTrigger)) <=
      mentions?.length
  )
    popouts.add(await newPromise("mention", args, res));

  if (
    SettingValues.get("linkConfirmation", defaultSettings.linkConfirmation) &&
    Math.floor(SettingValues.get("linkTrigger", defaultSettings.linkTrigger)) <= links?.length
  )
    popouts.add(await newPromise("link", args, res));

  const tokenConfirmation = await newPromise("default", args, res);
  if (!tokenConfirmation?.valid) popouts.add(tokenConfirmation);

  for (const valid of popouts) return valid as Types.openWarningPopout;

  return { valid: true };
};
export const patchWarningPopout = (): void => {
  const open = webpack.getFunctionKeyBySource<string>(WarningPopout, ".openWarningPopout");
  PluginInjector.instead(WarningPopout, open, (...props) => checkConditions(...props));
};
