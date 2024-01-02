import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { type UseCaseContext } from "../../types/core";
import { User, type IUserUseCase } from "../../types/user";
import {
  UserAlreadyExists,
  PasswordIsNotEqual,
  EmailAlreadyExists,
  EmailNotExists,
  EmailTokenAlreadyExists,
  EmailTokenNotExist,
  TokenValidationAttemptsExceeded,
  EmailTokenInvalid,
  TokenIsNotValidated,
} from "../../util/http";
import { sign } from "jsonwebtoken";
import dayjs from "dayjs";
import { Token } from "../../types/auth";
import { EmailToken } from "../../types/emailToken";
import { Chance } from "chance";

const chance = new Chance();

export class UserUseCase implements IUserUseCase {
  private readonly userService: UseCaseContext["userService"];
  private readonly authService: UseCaseContext["authService"];
  private readonly emailTokenService: UseCaseContext["emailTokenService"];

  constructor(ctx: UseCaseContext) {
    this.userService = ctx.userService;
    this.authService = ctx.authService;
    this.emailTokenService = ctx.emailTokenService;
  }

  async createUser(params: User): Promise<void> {
    try {
      const { name, lastName, user, email, password, confirmPassword } = params;

      const userAlreadyExists = await this.userService.getByUserOrEmail({
        user: user,
      });

      if (userAlreadyExists) {
        throw new UserAlreadyExists("User exists, try again");
      }

      const emailAlreadyExists = await this.userService.getByUserOrEmail({
        email: email,
      });

      if (emailAlreadyExists) {
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
      emailAlreadyExists.password
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

  async verifyEmail(params: EmailToken): Promise<void> {
    const { email } = params;

    const emailAlreadyExists = await this.userService.getByUserOrEmail({
      email,
    });

    if (!emailAlreadyExists) {
      throw new EmailAlreadyExists("Email not exists, try again");
    }

    const checkEmailToken = await this.emailTokenService.checkEmailToken({
      email,
    });

    if (checkEmailToken) {
      throw new EmailTokenAlreadyExists(
        "The Token has already been created, please validate it"
      );
    }

    const token = chance.string({ numeric: true, length: 6 });

    await this.emailTokenService.createEmailToken({
      email,
      token,
      validated: false,
      attempts: 0,
    });

    await this.emailTokenService.sendEmailToken({
      email,
      token,
    });
  }

  async validToken(params: Partial<EmailToken>): Promise<void> {
    const { email, token } = params;

    const checkEmailToken = await this.emailTokenService.checkEmailToken({
      email,
    });

    if (!checkEmailToken) {
      throw new EmailTokenNotExist(
        "The email token does not exist, please create it"
      );
    }

    if (checkEmailToken.attempts === 3) {
      await this.emailTokenService.deleteEmailToken({ email });

      throw new TokenValidationAttemptsExceeded(
        "Number of attempts exceeded, please create a new token"
      );
    }

    const compareToken = token === checkEmailToken.token;

    if (!compareToken) {
      await this.emailTokenService.updateAttemptsEmailToken({
        email,
        attempts: checkEmailToken.attempts + 1,
      });

      throw new EmailTokenInvalid("The Token sent is invalid, try again");
    }

    await this.emailTokenService.updateEmailToken({
      email,
      validated: true,
    });
  }

  async changePassword(params: Partial<User>): Promise<void> {
    const { email, password, confirmPassword } = params;

    const emailAlreadyExists = await this.userService.getByUserOrEmail({
      email,
    });

    if (!emailAlreadyExists) {
      throw new EmailAlreadyExists("Email not exists, try again");
    }

    const comparePassword = password === confirmPassword;

    if (!comparePassword) {
      throw new PasswordIsNotEqual("Password is not equal");
    }

    const checkEmailToken = await this.emailTokenService.checkEmailToken({
      email,
    });

    if (!checkEmailToken) {
      throw new EmailTokenNotExist(
        "The email token does not exist, please create it"
      );
    }

    if (checkEmailToken.validated !== true) {
      throw new TokenIsNotValidated(
        "The Token has not yet been validated, please try again"
      );
    }

    await this.userService.changePassword({
      email,
      password: await bcrypt.hash(password, 8),
    });

    await this.emailTokenService.deleteEmailToken({ email });
  }
}
