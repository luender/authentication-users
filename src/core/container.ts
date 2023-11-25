import { UserUseCase } from "./useCase/user";

import { UserService } from "./service/user";

import { type Container, type ContainerConfig } from "../types/core";
import { AuthService } from "./service/auth";

export function createContainer(config: ContainerConfig): Container {
  const serviceContext = {
    userRepository: config.userRepository,
    authRepository: config.authRepository,
  };

  const useCaseContext = {
    userService: new UserService(serviceContext),
    authService: new AuthService(serviceContext),
  };

  return {
    userUseCase: new UserUseCase(useCaseContext),
  };
}
