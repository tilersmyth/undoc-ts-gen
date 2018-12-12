import * as typedoc from "typedoc";
import * as yup from "yup";

import { Output } from "./Output";
import { FileUtils } from "../utils/FileUtils";

export class Convert {
  files: string[];

  constructor(files: string[]) {
    this.files = files;
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
      return JSON.parse(file);
    } catch (err) {
      throw err;
    }
  }

  converter = (application: any) => {
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
    const tdFile = await Convert.tdFile();
    const schema = Convert.schema();

    try {
      await schema.validate(tdFile);
    } catch (err) {
      throw `TypeDoc (td.json) file schema invalid:\n${err.message}`;
    }

    try {
      const app = new typedoc.Application(tdFile);
      const results = await this.converter(app);
      app.converter.off("all");
      return results;
    } catch (err) {
      throw err;
    }
  };
}
