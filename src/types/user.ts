import { Token } from "./auth";
import { EmailToken } from "./emailToken";

export type User = {
  name: string;
  lastName: string;
  user: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export interface IUserUseCase {
  createUser(params: User): Promise<void>;

  authUser(params: Partial<User>): Promise<Token>;

  verifyEmail(params: EmailToken): Promise<void>;

  validToken(params: Partial<EmailToken>): Promise<void>;

  changePassword(params: Partial<User>): Promise<void>;
}

export interface IUserService {
  createNewUser(params: Partial<User>): Promise<void>;

  getByUserOrEmail(params: Partial<User>): Promise<Partial<User>>;

  changePassword(params: Partial<User>): Promise<void>;
}

export interface IUserRepository {
  createNewUser(user: Partial<User>): Promise<void>;

  getByUser(user: Pick<User, "user">): Promise<Pick<User, "user">>;

  getByEmail(email: Pick<User, "email">): Promise<Pick<User, "email">>;

  changePassword(params: Partial<User>): Promise<void>;
}
