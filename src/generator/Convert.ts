import * as yup from "yup";

import { Application } from "typedoc/dist/lib/application";

import { Output } from "./Output";
import { FileUtils } from "../utils/FileUtils";

export class Convert {
  files: string[];
  update: boolean;

  constructor(files: string[], update: boolean) {
    this.files = files;
    this.update = update;
  }

  private static schema() {
    return yup.object().shape({
      mode: yup.string().required(),
      json: yup.string().required(),
      module: yup.string().required(),
      logger: yup.string().required(),
      target: yup.string().required(),
      ignoreCompilerErrors: yup.boolean().required(),
      excludePrivate: yup.boolean().required(),
      excludeProtected: yup.boolean().required(),
      hideGenerator: yup.boolean().required(),
      stripInternal: yup.boolean().required()
    });
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

  converter = (application: Application) => {
    return new Promise(async (resolve, reject) => {
      try {
        application.converter.on("all", new Output().logger);

        const rootDir = FileUtils.rootDirectory();
        const done = application.generateJson(
          application.expandInputFiles(this.files),
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
      const posFiles = this.update ? this.files : [];
      app.options.setValue("npFiles", posFiles);
      const results = await this.converter(app);
      app.converter.off("all");
      return results;
    } catch (err) {
      throw err;
    }
  };
}
