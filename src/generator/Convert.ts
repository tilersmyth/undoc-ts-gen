import { Application } from "typedoc/dist/lib/application";

import { FileUtils } from "../utils/FileUtils";

import GeneratorEvents from "../Events";

export class Convert {
  addedFiles: string[];
  modifiedFiles: string[];

  constructor(addedFiles: string[], modifiedFiles: string[]) {
    this.addedFiles = addedFiles;
    this.modifiedFiles = modifiedFiles;
  }

  private static async tdFile(): Promise<any> {
    try {
      const file = await FileUtils.readFile(".undoc/td.json");
      const options = JSON.parse(file);
      return options;
    } catch (err) {
      throw err;
    }
  }

  private event = (event: string, context: any) => {
    GeneratorEvents.emitter(`generator_${event}`, context);
  };

  converter = (application: Application) => {
    return new Promise(async (resolve, reject) => {
      try {
        application.converter.on("all", this.event);

        const allFiles = [...this.addedFiles, ...this.modifiedFiles];
        const rootDir = FileUtils.rootDirectory();
        const done = application.generateJson(
          application.expandInputFiles(allFiles),
          `${rootDir}/.undoc/docs.json`
        );

        resolve(done);
      } catch (err) {
        reject(err);
        return;
      }
    });
  };

  generate = async () => {
    try {
      const tdFile = await Convert.tdFile();
      const app = new Application(tdFile);
      app.options.setValue("npFiles", this.modifiedFiles);
      const results = await this.converter(app);
      app.converter.off("all");
      return results;
    } catch (err) {
      throw err;
    }
  };
}
