import { webpack } from "replugged";
import Types from "../types";

export const Modules: Types.Modules = {};

Modules.loadModules = async (): Promise<void> => {
  Modules.WarningPopout ??= await webpack.waitForProps<Types.WarningPopout>(
    "applyChatRestrictions",
  );
  Modules.PermissionStore = webpack.getByStoreName<Types.PermissionStore>("PermissionStore");
};

export default Modules;
