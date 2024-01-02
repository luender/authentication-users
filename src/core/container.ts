import { UserUseCase } from "./useCase/user";

import { UserService } from "./service/user";

import { type Container, type ContainerConfig } from "../types/core";
import { AuthService } from "./service/auth";
import { EmailTokenService } from "./service/emailToken";

export function createContainer(config: ContainerConfig): Container {
  const serviceContext = {
    userRepository: config.userRepository,
    authRepository: config.authRepository,
    emailTokenRepository: config.emailTokenRepository,
  };

  const useCaseContext = {
    userService: new UserService(serviceContext),
    authService: new AuthService(serviceContext),
    emailTokenService: new EmailTokenService(serviceContext),
  };

  return {
    userUseCase: new UserUseCase(useCaseContext),
  };
}
