import { type ContainerConfig } from "../../types/core";
import { type IMysqlAdapter } from "../../types/infrastructure";
import { User, type IUserRepository } from "../../types/user";
import R from "ramda";

interface Context {
  config: ContainerConfig;
  mysqlAdapter: IMysqlAdapter;
}

export class UserRepository implements IUserRepository {
  private readonly mysqlAdapter: IMysqlAdapter;

  constructor({ mysqlAdapter }: Context) {
    this.mysqlAdapter = mysqlAdapter;
    this.mysqlAdapter.tableName = "users";
  }

  async createNewUser(user: Partial<User>): Promise<void> {
    try {
      await this.mysqlAdapter.db.insert(user);
    } catch (error) {}
  }

  async getByUser(user: Pick<User, "user">): Promise<Pick<User, "user">> {
    try {
      const searchUser = await this.mysqlAdapter.db.where(user);

      const verify = R.isEmpty(searchUser) ? null : searchUser[0];

      return Object.fromEntries(verify) as User;
    } catch (error) {}
  }

  async getByEmail(email: Pick<User, "email">): Promise<Pick<User, "email">> {
    try {
      const searchEmail = await this.mysqlAdapter.db.where(email);
      const verify = R.isEmpty(searchEmail) ? null : searchEmail[0];

      return verify;
    } catch (error) {}
  }

  async changePassword(params: Partial<User>): Promise<void> {
    try {
      const { email, password } = params;

      await this.mysqlAdapter.db
        .where("email", "=", email)
        .update({ password: password });
    } catch (error) {}
  }
}
