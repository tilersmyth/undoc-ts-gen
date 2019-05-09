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

  const context = "Generating TypeDoc JSON";
  GeneratorEvents.emitter("generator_init", context);

  // Indicating that this generator instance includes
  // updated files
  const hasUpdate = oldFiles.length > 0;

  if (hasUpdate) {
    await new Convert(oldFiles, hasUpdate).generate(true);
  }

  await new Convert(allFiles, hasUpdate).generate(false);

  return true;
};
