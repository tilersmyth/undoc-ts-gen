import { SetConfigFile } from "./setup/SetConfigFile";
import { Convert } from "./generator/Convert";

export const setup = async (): Promise<void> => {
  return new SetConfigFile().run();
};

export const generate = async (
  allFiles: string[],
  modifiedFiles: string[]
): Promise<{}> => {
  return new Convert(allFiles, modifiedFiles).generate();
};
