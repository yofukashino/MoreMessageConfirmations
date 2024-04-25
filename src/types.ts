import { types } from "replugged";
import { Store } from "replugged/dist/renderer/modules/common/flux";
import GeneralDiscordTypes from "discord-types/general";

export namespace Types {
  export import DefaultTypes = types;
  export type Channel = GeneralDiscordTypes.Channel;
  export type GenericModule = Record<string, DefaultTypes.AnyFunction>;
  export interface PermissionStore extends Store {
    can: DefaultTypes.AnyFunction;
    canAccessGuildSettings: DefaultTypes.AnyFunction;
    canBasicChannel: DefaultTypes.AnyFunction;
    canImpersonateRole: DefaultTypes.AnyFunction;
    canManageUser: DefaultTypes.AnyFunction;
    canWithPartialContext: DefaultTypes.AnyFunction;
    computePermissions: DefaultTypes.AnyFunction;
    getChannelPermissions: DefaultTypes.AnyFunction;
    getChannelsVersion: DefaultTypes.AnyFunction;
    getGuildPermissionProps: DefaultTypes.AnyFunction;
    getPermissionUtils: DefaultTypes.AnyFunction;
    getGuildVersion: DefaultTypes.AnyFunction;
    getHighestRole: DefaultTypes.AnyFunction;
    initialize: DefaultTypes.AnyFunction;
    isRoleHigher: DefaultTypes.AnyFunction;
    clearVars: DefaultTypes.AnyFunction;
  }

  export interface WarningPopoutReason {
    valid: boolean;
    failureReason?: string;
  }
  export interface WarningPopout {
    applyChatRestrictions: (chatInfo: {
      channel: Channel;
      content: string;
      openWarningPopout: (warningInfo: {
        analyticsType: string;
        animation: null | string;
        channel: Channel;
        onCancel: () => void;
        onConfirm: () => void;
        popoutText?: {
          body: string;
          footer: string;
        };
      }) => void;
      uploads: unknown[];
    }) => Promise<WarningPopoutReason>;
  }
  export interface Modules {
    loadModules?: () => Promise<void>;
    WarningPopout?: WarningPopout;
    PermissionStore?: PermissionStore;
  }
  export interface Settings {
    inviteConfirmation: boolean;
    inviteTrigger: number;
    slowmodeConfirmation: boolean;
    slowmodeTrigger: number;
    uploadConfirmation: boolean;
    uploadTrigger: number;
    mentionConfirmation: boolean;
    mentionTrigger: number;
    linkConfirmation: boolean;
    linkTrigger: number;
  }
}
export default Types;
