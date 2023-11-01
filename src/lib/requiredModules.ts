import { webpack } from "replugged";
import Types from "../types";
export const WarningPopout = webpack.getByProps<Types.GenericModule>("applyChatRestrictions");
export const PermissionStore = webpack.getByStoreName<Types.PermissionStore>("PermissionStore");
