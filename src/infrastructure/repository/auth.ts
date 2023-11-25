import { IAuthRepository, RefreshToken } from "../../types/auth";
import { ContainerConfig } from "../../types/core";
import { IMysqlAdapter } from "../../types/infrastructure";

interface Context {
  config: ContainerConfig;
  mysqlAdapter: IMysqlAdapter;
}

export class AuthRepository implements IAuthRepository {
  private readonly mysqlAdapter: IMysqlAdapter;

  constructor({ mysqlAdapter }: Context) {
    this.mysqlAdapter = mysqlAdapter;
    this.mysqlAdapter.tableName = "auth";
  }

  async createRefreshToken(params: RefreshToken): Promise<void> {
    try {
      const { email, expiresIn, refreshToken } = params;

      await this.mysqlAdapter.db.insert({
        email,
        expiresIn,
        refresh_token: refreshToken,
      });
    } catch (error) {}
  }
}
