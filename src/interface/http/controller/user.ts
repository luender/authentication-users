import httpStatus from "http-status-codes";

import {
  HttpControllerConfig,
  HttpRouter,
  IHttpRoute,
} from "../../../types/interface";
import { Router } from "express";

export class UserController implements IHttpRoute {
  private validator: HttpControllerConfig["validator"];
  private userUseCase: HttpControllerConfig["coreContainer"];

  constructor({ validator, coreContainer }: HttpControllerConfig) {
    this.validator = validator;
    this.userUseCase = coreContainer;
  }

  register(router: HttpRouter) {}
}
