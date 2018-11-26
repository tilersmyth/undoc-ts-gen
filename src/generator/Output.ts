import chalk from "chalk";
import * as readline from "readline";

/**
 * Output for TypeDoc generateJson
 */
export class Output {
  fileCount: number = 0;
  reflectionTotal: number = 0;
  reflectionCount: number = 0;

  private static writeOutput(value: string) {
    readline.clearLine(process.stdout, 0);
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(chalk.white(`${value}`));
  }

  logger = (event: string, context: any) => {
    if (event === "begin") {
      console.log(chalk.white("Started TypeDoc compiling"));
    }

    if (event === "fileBegin") {
      const count = this.fileCount++;
      Output.writeOutput(`Reviewing ${count} files`);
    }

    if (event === "resolveBegin") {
      this.reflectionTotal = Object.keys(context.project.reflections).length;
      console.log("");
    }

    if (event === "resolveReflection") {
      const count = this.reflectionCount++;
      const total = this.reflectionTotal;
      const percentage = ((count / total) * 100).toFixed(0);
      Output.writeOutput(`Resolving reflections ${percentage}%`);
    }

    if (event === "end") {
      console.log(chalk.white("\nFinished TypeDoc compiling"));
    }
  };
}
