import { SetConfigFile } from "./setup/SetConfigFile";
import { Convert } from "./generator/Convert";

import GeneratorEvents from "./Events";

export const setup = async (): Promise<void> => {
  return new SetConfigFile().run();
};

export const generate = async (
  undocEventEmitter: any,
  allFiles: string[],
  isUpdate: boolean
): Promise<boolean> => {
  GeneratorEvents.emitter = undocEventEmitter;

  const context = "Generating TypeDoc JSON";
  GeneratorEvents.emitter("generator_init", context);

  await new Convert(allFiles).generate(isUpdate);

  return true;
};
