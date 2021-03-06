import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";

/**
 * Command line utils functions.
 */
export class FileUtils {
  /**
   * Returns root directory of project
   */
  static rootDirectory() {
    return process.cwd();
  }

  /**
   * Creates directories recursively
   */
  static createDirectories(directory: string) {
    return new Promise((ok, fail) => {
      const root = FileUtils.rootDirectory();
      return mkdirp(`${root}/${directory}`, (err: any) =>
        err ? fail(err) : ok()
      );
    });
  }

  /**
   * Creates a file with the given content in the given path
   */
  static async createFile(
    filePath: string,
    content: string,
    override: boolean = true
  ): Promise<void> {
    await FileUtils.createDirectories(path.dirname(filePath));
    return new Promise<void>((ok, fail) => {
      if (override === false && fs.existsSync(filePath)) return ok();

      fs.writeFile(filePath, content, err => (err ? fail(err) : ok()));
    });
  }

  /**
   * Reads everything from a given file and returns its content as a string
   */
  static async readFile(filePath: string): Promise<string> {
    const root = FileUtils.rootDirectory();
    return new Promise<string>((ok, fail) => {
      fs.readFile(`${root}/${filePath}`, (err, data) =>
        err ? fail(err) : ok(data.toString())
      );
    });
  }
}
