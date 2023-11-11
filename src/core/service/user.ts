import { ServiceContext } from "../../types/core";
import { IUserService } from "../../types/user";

export class UserService implements IUserService {
  private userRepository: ServiceContext["userRepository"];

  constructor(ctx: ServiceContext) {
    this.userRepository = ctx.userRepository;
  }
}
