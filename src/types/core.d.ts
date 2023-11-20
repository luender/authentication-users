import { type IUserService, type IUserUseCase } from "./user";

import { type Container as infraContainer } from "./infrastructure";

export interface Container {
  userUseCase: IUserUseCase;
}

export interface ContainerConfig {
  userRepository: infraContainer["userRepository"];
}

export interface ServiceContext {
  userRepository: ContainerConfig["userRepository"];
}

export interface UseCaseContext {
  userService: IUserService;
}
