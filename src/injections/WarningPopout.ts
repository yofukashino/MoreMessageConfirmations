import { PluginInjector, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Modules from "../lib/requiredModules";
import Utils from "../lib/utils";
import Types from "../types";

export default (): void => {
  PluginInjector.instead(
    Modules.WarningPopout,
    "applyChatRestrictions",
    async (args, res, _instance) => {
      const [{ channel, content, uploads, openWarningPopout }] = args;
      const invites = Utils.getInvites(content);
      const mentions = Utils.getMentions(content);
      const links = Utils.getLinks(content);
      const popouts = new Set<Types.WarningPopoutReason>();
      if (!openWarningPopout) return { valid: true };
      if (
        SettingValues.get("inviteConfirmation", defaultSettings.inviteConfirmation) &&
        !channel.isDM() &&
        !channel.isGroupDM() &&
        Math.floor(SettingValues.get("inviteTrigger", defaultSettings.inviteTrigger)) <=
          invites?.length
      )
        await Utils.addWarningPopoutReason("invite", popouts, args, res);

      if (
        SettingValues.get("slowmodeConfirmation", defaultSettings.slowmodeConfirmation) &&
        !Utils.canBypassSlowmode(channel) &&
        Math.floor(SettingValues.get("slowmodeTrigger", defaultSettings.slowmodeTrigger)) <=
          channel?.rateLimitPerUser
      )
        await Utils.addWarningPopoutReason("slowmode", popouts, args, res);

      if (
        SettingValues.get("uploadConfirmation", defaultSettings.uploadConfirmation) &&
        Math.floor(SettingValues.get("uploadTrigger", defaultSettings.uploadTrigger)) <=
          uploads?.length
      )
        await Utils.addWarningPopoutReason("upload", popouts, args, res);

      if (
        SettingValues.get("mentionConfirmation", defaultSettings.mentionConfirmation) &&
        Math.floor(SettingValues.get("mentionTrigger", defaultSettings.mentionTrigger)) <=
          mentions?.length
      )
        await Utils.addWarningPopoutReason("mention", popouts, args, res);

      if (
        SettingValues.get("linkConfirmation", defaultSettings.linkConfirmation) &&
        Math.floor(SettingValues.get("linkTrigger", defaultSettings.linkTrigger)) <= links?.length
      )
        await Utils.addWarningPopoutReason("link", popouts, args, res);

      await Utils.addWarningPopoutReason("", popouts, args, res);

      for (const valid of popouts) return valid;

      return { valid: true };
    },
  );
};
