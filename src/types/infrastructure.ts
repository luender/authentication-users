import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IUserRepository } from "./user";
import { Knex } from "knex";

export interface IHttpAdapter {
  send(config: AxiosRequestConfig): Promise<AxiosResponse>;
}

export interface IHttpAdapterConstructs {
  new (config: AxiosRequestConfig): IHttpAdapter;
}

export type MysqlDatabase = Knex;

export type MysqlAdapterConfig = {
  dbConn: MysqlDatabase;
};

export interface IMysqlAdapter {
  db: Knex.QueryBuilder;
  tableName: string;
}

export type Container = {
  userRepository: IUserRepository;
};

export type ContainerConfig = Container;
