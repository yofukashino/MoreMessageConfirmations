import { util } from "replugged";
import { Category, SliderItem, SwitchItem } from "replugged/components";
import { PluginLogger, SettingValues } from "../index";
import { defaultSettings } from "../lib/consts";
import Utils from "../lib/utils";
import Types from "../types";

export const registerSettings = (): void => {
  for (const key in defaultSettings) {
    if (SettingValues.has(key as keyof Types.Settings)) return;
    PluginLogger.log(`Adding new setting ${key} with value ${defaultSettings[key]}.`);
    SettingValues.set(key as keyof Types.Settings, defaultSettings[key]);
  }
};

export const Settings = () => {
  return (
    <div>
      <Category title="Discord Invites" open={false}>
        <SwitchItem
          note="Whether to show a confirmation dialog when sending message containing discord invites. (Wouldn't show in DMs and Group DMs)"
          {...util.useSetting(
            SettingValues,
            "inviteConfirmation",
            defaultSettings.inviteConfirmation,
          )}>
          Show confirmation
        </SwitchItem>
        <SliderItem
          note="The minimum number of invites to get a confirmation prompt."
          initialValue={SettingValues.get("inviteTrigger", defaultSettings.inviteTrigger)}
          minValue={1}
          maxValue={10}
          markers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          stickToMarkers={true}
          onValueRender={(value: number) => Math.floor(value).toLocaleString()}
          {...util.useSetting(SettingValues, "inviteTrigger", defaultSettings.inviteTrigger)}>
          Confirmation trigger
        </SliderItem>
      </Category>
      <Category title="Slowmode" open={false}>
        <SwitchItem
          note="Whether to show a confirmation dialog for sending a message in a channel in which slowmode applies to you."
          {...util.useSetting(
            SettingValues,
            "slowmodeConfirmation",
            defaultSettings.slowmodeConfirmation,
          )}>
          Show confirmation
        </SwitchItem>
        <SliderItem
          note="The minimum duration of slowmode in minutes to get a confirmation prompt."
          initialValue={SettingValues.get("slowmodeTrigger", defaultSettings.slowmodeTrigger)}
          minValue={30}
          maxValue={1800}
          onValueRender={(value: number) => Utils.toDaysMinutesSeconds(value)}
          {...util.useSetting(SettingValues, "slowmodeTrigger", defaultSettings.slowmodeTrigger)}>
          Confirmation trigger
        </SliderItem>
      </Category>
      <Category title="File upload" open={false}>
        <SwitchItem
          note="Whether to show a confirmation dialog for uploading files."
          {...util.useSetting(
            SettingValues,
            "uploadConfirmation",
            defaultSettings.uploadConfirmation,
          )}>
          Show confirmation
        </SwitchItem>
        <SliderItem
          note="The minimum number of files to get a confirmation prompt."
          initialValue={SettingValues.get("uploadTrigger", defaultSettings.uploadTrigger)}
          minValue={1}
          maxValue={10}
          markers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          stickToMarkers={true}
          onValueRender={(value: number) => Utils.toDaysMinutesSeconds(value)}
          {...util.useSetting(SettingValues, "uploadTrigger", defaultSettings.uploadTrigger)}>
          Confirmation trigger
        </SliderItem>
      </Category>
      <Category title="User mentions" open={false}>
        <SwitchItem
          note="Whether to show a confirmation dialog for mentioning users."
          {...util.useSetting(
            SettingValues,
            "mentionConfirmation",
            defaultSettings.mentionConfirmation,
          )}>
          Show confirmation
        </SwitchItem>
        <SliderItem
          note="The minimum number of user mentions to get a confirmation prompt."
          initialValue={SettingValues.get("mentionTrigger", defaultSettings.mentionTrigger)}
          minValue={1}
          maxValue={10}
          markers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          stickToMarkers={true}
          onValueRender={(value: number) => Utils.toDaysMinutesSeconds(value)}
          {...util.useSetting(SettingValues, "mentionTrigger", defaultSettings.mentionTrigger)}>
          Confirmation trigger
        </SliderItem>
      </Category>
      <Category title="Links" open={false}>
        <SwitchItem
          note="Whether to show a confirmation dialog when sending any sort of link."
          {...util.useSetting(
            SettingValues,
            "uploadConfirmation",
            defaultSettings.uploadConfirmation,
          )}>
          Show confirmation
        </SwitchItem>
        <SliderItem
          note="The minimum number of links to get a confirmation prompt."
          initialValue={SettingValues.get("linkTrigger", defaultSettings.linkTrigger)}
          minValue={1}
          maxValue={10}
          markers={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
          stickToMarkers={true}
          onValueRender={(value: number) => Utils.toDaysMinutesSeconds(value)}
          {...util.useSetting(SettingValues, "linkTrigger", defaultSettings.linkTrigger)}>
          Confirmation trigger
        </SliderItem>
      </Category>
    </div>
  );
};

export default { registerSettings, Settings };
