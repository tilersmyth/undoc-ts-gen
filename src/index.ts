import { SetConfigFile } from "./setup/SetConfigFile";
import { Convert } from "./generator/Convert";

export const setup = async (): Promise<void> => {
  return new SetConfigFile().run();
};

export const generate = async (
  files: string[],
  update: boolean
): Promise<{}> => {
  return new Convert(files, update).generate();
};
