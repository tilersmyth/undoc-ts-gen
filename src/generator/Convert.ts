import { Application } from "typedoc/dist/lib/application";

import { FileUtils } from "../utils/FileUtils";

import GeneratorEvents from "../Events";

export class Convert {
  allFiles: string[];

  constructor(allFiles: string[]) {
    this.allFiles = allFiles;
  }

  private tdConfig: any = {
    mode: "modules",
    module: "commonjs",
    logger: "none",
    ignoreCompilerErrors: true,
    excludePrivate: true,
    excludeProtected: true,
    hideGenerator: true,
    stripInternal: true
  };

  private static async tdFile(): Promise<any> {
    try {
      const file = await FileUtils.readFile(".undoc/config.json");
      const options = JSON.parse(file);
      return options;
    } catch (err) {
      throw err;
    }
  }

  private application = async (): Promise<Application> => {
    const config = await Convert.tdFile();
    this.tdConfig.target = config.target;

    const app = new Application(this.tdConfig);

    return app;
  };

  private event = (event: string, context: any) => {
    GeneratorEvents.emitter(`generator_${event}`, context);
  };

  converter = (application: Application, jsonPath: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        application.converter.on("all", this.event);

        const rootDir = FileUtils.rootDirectory();

        const done = application.generateJson(
          application.expandInputFiles(this.allFiles),
          `${rootDir}/${jsonPath}`
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
      const app = await this.application();

      app.options.setValue("excludeExternals", isUpdate);

      const path = `.undoc/temp/${isUpdate ? "old" : "new"}.json`;
      const results = await this.converter(app, path);

      app.converter.off("all");
      return results;
    } catch (err) {
      throw err;
    }
  };
}
