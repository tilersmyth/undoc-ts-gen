import { SetConfigFile } from "./setup/SetConfigFile";
import { Convert } from "./generator/Convert";

import GeneratorEvents from "./Events";

export const setup = async (): Promise<void> => {
  return new SetConfigFile().run();
};

export const generate = async (
  undocEventEmitter: any,
  oldFiles: string[],
  allFiles: string[]
): Promise<boolean> => {
  GeneratorEvents.emitter = undocEventEmitter;

  if (oldFiles.length > 0) {
    await new Convert(oldFiles).generate(true);
  }

  const context = "Generating TypeDoc JSON";
  GeneratorEvents.emitter("generator_init", context);

  await new Convert(allFiles).generate(false);

  return true;
};
