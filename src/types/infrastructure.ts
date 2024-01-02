import { type AxiosRequestConfig, type AxiosResponse } from "axios";
import { type IUserRepository } from "./user";
import { type Knex } from "knex";
import { IAuthRepository } from "./auth";
import { IEmailTokenRepository } from "./emailToken";

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
  emailTokenRepository: IEmailTokenRepository;
}

export type ContainerConfig = Container;
