import { type ServiceContext } from "../../types/core";
import { User, type IUserService } from "../../types/user";

export class UserService implements IUserService {
  private readonly userRepository: ServiceContext["userRepository"];

  constructor(ctx: ServiceContext) {
    this.userRepository = ctx.userRepository;
  }

  async createNewUser(params: Partial<User>): Promise<void> {
    await this.userRepository.createNewUser(params);
  }

  async getByUserOrEmail(params: Partial<User>): Promise<Partial<User>> {
    if (params.user) {
      const user = await this.userRepository.getByUser({
        user: params.user,
      });

      return user;
    }

    const email = await this.userRepository.getByEmail({
      email: params.email,
    });

    return email;
  }
}
