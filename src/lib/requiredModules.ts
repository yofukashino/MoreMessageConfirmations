import { webpack } from "replugged";
import * as Types from "../types";
export const WarningPopout = webpack.getBySource<Types.GenericModule | string>(
  ".openWarningPopout",
);
export const PermissionStore = webpack.getByProps<Types.PermissionStore>("getChannelPermissions");
