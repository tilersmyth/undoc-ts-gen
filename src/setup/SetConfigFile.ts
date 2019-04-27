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

  run = async (): Promise<void> => {
    try {
      const { projectTarget } = await (<any>inquirer.prompt(this.inputs));

      if (!projectTarget) {
        throw "error creating project file";
      }

      const configFile = await FileUtils.readFile(".undoc/config.json");

      if (!configFile) {
        throw "Undoc configuration file not found.";
      }

      const parsedConfigFile = JSON.parse(configFile);
      parsedConfigFile.target = projectTarget;

      await FileUtils.createFile(
        ".undoc/config.json",
        JSON.stringify(parsedConfigFile)
      );
    } catch (err) {
      throw err;
    }
  };
}
