import { env } from "./util/env";
import Logger from "./util/logger";

import { createContainer } from "./interface/container";

type AppConfig = {
  http?: boolean;
};

export class App {
  private http?: boolean;

  constructor({ http }: AppConfig) {
    this.http = http;
  }

  run() {
    const interfaceContainer = createContainer({
      env,
      init: {
        http: this.http,
      },
    });

    if (this.http) {
      interfaceContainer.httpInterface?.serve();
    }
  }
}

const app = new App({
  http: env.httpActive,
});

setImmediate(() => {
  app.run();
  Logger.debug("app initialized");
});
