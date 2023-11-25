import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { type UseCaseContext } from "../../types/core";
import { User, type IUserUseCase } from "../../types/user";
import {
  UserAlreadyExists,
  PasswordIsNotEqual,
  EmailAlreadyExists,
  EmailNotExists,
} from "../../util/http";
import { sign } from "jsonwebtoken";
import dayjs from "dayjs";
import { Token } from "../../types/auth";

export class UserUseCase implements IUserUseCase {
  private readonly userService: UseCaseContext["userService"];
  private readonly authService: UseCaseContext["authService"];

  constructor(ctx: UseCaseContext) {
    this.userService = ctx.userService;
    this.authService = ctx.authService;
  }

  async createUser(params: User): Promise<void> {
    try {
      const { name, lastName, user, email, password, confirmPassword } = params;

      const verifiedUser = await this.userService.getByUserOrEmail({
        user: user,
      });

      if (verifiedUser) {
        throw new UserAlreadyExists("User exists, try again");
      }

      const verifiedEmail = await this.userService.getByUserOrEmail({
        email: email,
      });

      if (verifiedEmail) {
        throw new EmailAlreadyExists("Email exists, try again");
      }

      const comparePassword = password === confirmPassword;

      if (!comparePassword) {
        throw new PasswordIsNotEqual("Password is not equal");
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

  async authUser(params: Partial<User>): Promise<Token> {
    const { email, password } = params;

    const emailAlreadyExists = await this.userService.getByUserOrEmail({
      email: email,
    });

    if (!emailAlreadyExists) {
      throw new EmailNotExists("Email not exists, try again");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      emailAlreadyExists[0].password
    );

    if (!passwordMatch) {
      throw new PasswordIsNotEqual("Password is not equal");
    }

    const secrectKey = process.env.SECRET_KEY;

    const token = sign({}, secrectKey, {
      subject: email,
      expiresIn: "30s",
    });

    const expiresIn = dayjs().add(120, "second").unix();

    const refreshToken = uuidv4();

    await this.authService.createRefreshToken({
      email,
      expiresIn,
      refreshToken,
    });

    return {
      token,
      refreshToken,
    };
  }
}
