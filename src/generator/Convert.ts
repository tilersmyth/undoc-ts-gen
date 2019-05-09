import { Application } from "typedoc/dist/lib/application";

import { FileUtils } from "../utils/FileUtils";
import { ConverterEvents } from "./Events";

export class Convert {
  constructor(private allFiles: string[], private hasUpdate: boolean) {
    this.allFiles = allFiles;
    this.hasUpdate = hasUpdate;
  }

  private tdConfig: any = {
    mode: "modules",
    module: "commonjs",
    logger: "none",
    excludeExternals: true,
    ignoreCompilerErrors: true,
    excludePrivate: true,
    excludeProtected: true,
    hideGenerator: true,
    stripInternal: true
  };

  private static async tdFile(): Promise<any> {
    try {
      const file = await FileUtils.readFile(".undoc/config.json");
      return JSON.parse(file);
    } catch (err) {
      throw err;
    }
  }

  private updateType = (isUpdate: boolean): string => {
    if (this.hasUpdate) {
      return `${isUpdate ? "diff" : "current"}\xa0`;
    }

    return "";
  };

  private converter = (application: Application, isUpdate: boolean) => {
    return new Promise(async (resolve, reject) => {
      try {
        const updateType = this.updateType(isUpdate);
        const events = new ConverterEvents(this.allFiles, updateType);
        application.converter.on("all", events.emit);

        const rootDir = FileUtils.rootDirectory();
        const path = `.undoc/temp/${isUpdate ? "old" : "new"}.json`;
        const done = application.generateJson(
          application.expandInputFiles(this.allFiles),
          `${rootDir}/${path}`
        );

        resolve(done);
      } catch (err) {
        reject(err);
        return;
      }
    });
  };

  generate = async (isUpdate: boolean) => {
    try {
      const config = await Convert.tdFile();
      this.tdConfig.target = config.target;
      const app = new Application(this.tdConfig);

      const results = await this.converter(app, isUpdate);

      app.converter.off("all");
      return results;
    } catch (err) {
      throw err;
    }
  };
}
