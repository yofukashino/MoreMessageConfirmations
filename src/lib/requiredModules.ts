import { webpack } from "replugged";
import Types from "../types";

export const Modules: Types.Modules = {};

Modules.loadModules = async (): Promise<void> => {
  Modules.WarningPopout ??= await webpack
    .waitForModule<Types.WarningPopout>(webpack.filters.bySource("valid:!1,failureReason"), {
      timeout: 10000,
    })
    .catch(() => {
      throw new Error("Failed To Find WarningPopout Module");
    });

  Modules.PermissionStore = webpack.getByStoreName<Types.PermissionStore>("PermissionStore");
};

export default Modules;
