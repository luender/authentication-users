import { HttpInterface } from "./http";
import { IHttpInterface } from "../types/interface";

import { createContainer as createCoreContainer } from "../core/container";
import { createContainer as createInfraContainer } from "../infrastructure/container";

type ContainerConfig = {
  env: any;
  init: {
    http?: boolean;
  };
};

type Container = {
  httpInterface?: IHttpInterface;
};

export function createContainer(config: ContainerConfig): Container {
  const container: Container = {};

  const infraContainer = createInfraContainer(config.env);
  const coreContainer = createCoreContainer(infraContainer);

  if (config.init.http) {
    container.httpInterface = new HttpInterface({
      env: config.env,
      coreContainer,
    });
  }

  return container;
}
