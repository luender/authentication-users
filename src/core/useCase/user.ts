import bcrypt from "bcryptjs";
import { type UseCaseContext } from "../../types/core";
import { User, type IUserUseCase } from "../../types/user";
import {
  EmailExisting,
  PasswordIsNotEqual,
  UserExisting,
} from "../../util/http";

export class UserUseCase implements IUserUseCase {
  private readonly userService: UseCaseContext["userService"];

  constructor(ctx: UseCaseContext) {
    this.userService = ctx.userService;
  }

  async createUser(params: User): Promise<void> {
    try {
      const { name, lastName, user, email, password, confirmPassword } = params;

      const verifiedUser = await this.userService.getByUserOrEmail({
        user: user,
      });

      if (verifiedUser) {
        throw new UserExisting("Usuário já existe, tente usar outro");
      }

      const verifiedEmail = await this.userService.getByUserOrEmail({
        email: email,
      });

      if (verifiedEmail) {
        throw new EmailExisting("Email já existe, tente usar outro");
      }

      const comparePassword = password === confirmPassword;

      if (!comparePassword) {
        throw new PasswordIsNotEqual(
          "As senhas não são iguais, por favor, tente novamente"
        );
      }

      const newUser = {
        name: `${name} ${lastName}`,
        user,
        email,
        password: await bcrypt.hash(password, 8),
      };

      await this.userService.createNewUser(newUser);
    } catch (error) {
      throw error;
    }
  }
}
