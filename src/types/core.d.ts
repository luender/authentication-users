import { type IUserService, type IUserUseCase } from "./user";

import { type Container as infraContainer } from "./infrastructure";
import { IAuthService } from "./auth";

export interface Container {
  userUseCase: IUserUseCase;
}

export interface ContainerConfig {
  userRepository: infraContainer["userRepository"];
  authRepository: infraContainer["authRepository"];
}

export interface ServiceContext {
  userRepository: ContainerConfig["userRepository"];
  authRepository: ContainerConfig["authRepository"];
}

export interface UseCaseContext {
  userService: IUserService;
  authService: IAuthService;
}
