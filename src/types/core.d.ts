import { type IUserService, type IUserUseCase } from "./user";

import { type Container as infraContainer } from "./infrastructure";
import { IAuthService } from "./auth";
import { IEmailTokenService } from "./emailToken";

export interface Container {
  userUseCase: IUserUseCase;
}

export interface ContainerConfig {
  userRepository: infraContainer["userRepository"];
  authRepository: infraContainer["authRepository"];
  emailTokenRepository: infraContainer["emailTokenRepository"];
}

export interface ServiceContext {
  userRepository: ContainerConfig["userRepository"];
  authRepository: ContainerConfig["authRepository"];
  emailTokenRepository: ContainerConfig["emailTokenRepository"];
}

export interface UseCaseContext {
  userService: IUserService;
  authService: IAuthService;
  emailTokenService: IEmailTokenService;
}
