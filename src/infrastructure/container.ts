import { UserRepository } from './repository/user'

import { MysqlAdapter } from './adapter/mysql'

import { type Container, type ContainerConfig } from '../types/infrastructure'

export function createContainer (config: ContainerConfig): Container {
  return {
    userRepository: new UserRepository({
      config,
      mysqlAdapter: new MysqlAdapter()
    })
  }
}
