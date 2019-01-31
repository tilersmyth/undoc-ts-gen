import * as inquirer from "inquirer";

import { FileUtils } from "../utils/FileUtils";

/**
 * Set config file required for undoc-ts
 */
export class SetConfigFile {
  private inputs = [
    {
      type: "list",
      name: "projectTarget",
      message: "Project ECMAScript target version:",
      choices: [
        { name: "ES6", value: "ES6" },
        { name: "ES5", value: "ES5" },
        { name: "ES3", value: "ES3" }
      ]
    }
  ];

  private tdJson: any = {
    mode: "modules",
    json: "./.undoc/docs.json",
    module: "commonjs",
    logger: "none",
    ignoreCompilerErrors: true,
    excludeExternals: false,
    excludePrivate: true,
    excludeProtected: true,
    hideGenerator: true,
    stripInternal: true
  };

  run = async (): Promise<void> => {
    try {
      const { projectTarget } = await (<any>inquirer.prompt(this.inputs));

      if (!projectTarget) {
        throw "error creating project file";
      }

      this.tdJson.target = projectTarget;

      await FileUtils.createFile(".undoc/td.json", JSON.stringify(this.tdJson));
    } catch (err) {
      throw err;
    }
  };
}
