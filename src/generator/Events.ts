import GeneratorEvents from "../Events";

export class ConverterEvents {
  private fileCount: number = 1;
  private reflectionTotal: number = 1;
  private reflectionCount: number = 1;

  constructor(private files: string[], private updateType: string) {
    this.files = files;
    this.updateType = updateType;
  }

  emit = (event: string, context: any) => {
    if (event === "fileBegin") {
      const total = this.files.length;
      const count = this.fileCount++;

      GeneratorEvents.emitter(
        `generator_${event}`,
        `Converting ${this.updateType}files ${((count / total) * 100).toFixed(
          0
        )}%`
      );
    }

    if (event === "resolveBegin") {
      this.reflectionTotal = Object.keys(context.project.reflections).length;
      GeneratorEvents.emitter(`generator_${event}`);
    }

    if (event === "resolveReflection") {
      const total = this.reflectionTotal;
      const count = this.reflectionCount++;
      GeneratorEvents.emitter(
        `generator_${event}`,
        `Resolving ${this.updateType}reflections ${(
          (count / total) *
          100
        ).toFixed(0)}%`
      );
    }

    if (event === "end") {
      GeneratorEvents.emitter(`generator_${event}`);
    }
  };
}
