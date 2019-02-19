import * as events from "events";

/**
 * Output for TypeDoc generateJson
 */
export class GeneratorEvents extends events.EventEmitter {
  constructor() {
    super();
  }

  event = (event: string, context: any) => {
    this.emit("e", `gen_${event}`, context);
  };
}
