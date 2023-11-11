import { UseCaseContext } from "../../types/core";
import { IUserUseCase } from "../../types/user";

export class UserUseCase implements IUserUseCase {
  private userService: UseCaseContext["userService"];

  constructor(ctx: UseCaseContext) {
    this.userService = ctx.userService;
  }
}
