import Modules from "../lib/requiredModules";
import injectWarningPopout from "./WarningPopout";
export const applyInjections = async (): Promise<void> => {
  await Modules.loadModules();
  injectWarningPopout();
};

export default { applyInjections };
