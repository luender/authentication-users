import { UserRepository } from "./repository/user";

import { MysqlAdapter } from "./adapter/mysql";

import { type Container, type ContainerConfig } from "../types/infrastructure";
import { AuthRepository } from "./repository/auth";

export function createContainer(config: ContainerConfig): Container {
  return {
    userRepository: new UserRepository({
      config,
      mysqlAdapter: new MysqlAdapter(),
    }),
    authRepository: new AuthRepository({
      config,
      mysqlAdapter: new MysqlAdapter(),
    }),
  };
}
