import httpStatus from "http-status-codes";

import {
  type HttpControllerConfig,
  type HttpNext,
  type HttpRequest,
  type HttpResponse,
  type HttpRouter,
  type IHttpRoute,
} from "../../../types/interface";

import { authUser, createUser } from "../schema/user";

export class UserController implements IHttpRoute {
  private readonly validator: HttpControllerConfig["validator"];
  private readonly userUseCase: HttpControllerConfig["coreContainer"]["userUseCase"];

  constructor({ validator, coreContainer }: HttpControllerConfig) {
    this.validator = validator;
    this.userUseCase = coreContainer.userUseCase;
  }

  register(router: HttpRouter) {
    router
      .route("/user")
      .post(this.validator(createUser), this.createUser.bind(this));
    router
      .route("/login")
      .post(this.validator(authUser), this.authUser.bind(this));
  }

  async createUser(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const data = req.body;

      await this.userUseCase.createUser(data);
      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  }

  async authUser(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const data = req.body;

      const token = await this.userUseCase.authUser(data);

      return res.status(httpStatus.OK).send(token);
    } catch (error) {
      return next(error);
    }
  }
}
