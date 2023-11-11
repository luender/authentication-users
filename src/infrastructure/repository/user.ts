import { ContainerConfig } from "../../types/core";
import { IMysqlAdapter } from "../../types/infrastructure";
import { IUserRepository } from "../../types/user";

type Context = {
  config: ContainerConfig;
  mysqlAdapter: IMysqlAdapter;
};

export class UserRepository implements IUserRepository {
  private mysqlAdapter: IMysqlAdapter;

  constructor({ mysqlAdapter }: Context) {
    this.mysqlAdapter = mysqlAdapter;
    this.mysqlAdapter.tableName = "";
  }
}
