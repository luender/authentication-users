import { UserUseCase } from './useCase/user'

import { UserService } from './service/user'

import { type Container, type ContainerConfig } from '../types/core'

export function createContainer (config: ContainerConfig): Container {
  const serviceContext = {
    userRepository: config.userRepository
  }

  const useCaseContext = {
    userService: new UserService(serviceContext)
  }

  return {
    userUseCase: new UserUseCase(useCaseContext)
  }
}
