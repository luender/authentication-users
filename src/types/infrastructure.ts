import { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { type IUserRepository } from "./user";
import { type Knex } from "knex";
import { IAuthRepository } from "./auth";

export interface IHttpAdapter {
  send: (config: AxiosRequestConfig) => Promise<AxiosResponse>;
}

export type IHttpAdapterConstructs = new (
  config: AxiosRequestConfig
) => IHttpAdapter;

export type MysqlDatabase = Knex;

export interface MysqlAdapterConfig {
  dbConn: MysqlDatabase;
}

export interface IMysqlAdapter {
  db: Knex.QueryBuilder;
  tableName: string;
}

export interface Container {
  userRepository: IUserRepository;
  authRepository: IAuthRepository;
}

export type ContainerConfig = Container;
