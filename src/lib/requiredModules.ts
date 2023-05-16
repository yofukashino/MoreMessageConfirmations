import { webpack } from "replugged";
import * as Types from "../types";
export const WarningPopout = webpack.getBySource(
  ".openWarningPopout",
) as unknown as Types.GenericModule;
export const PermissionStore = webpack.getByProps(
  "getChannelPermissions",
) as unknown as Types.PermissionStore;
