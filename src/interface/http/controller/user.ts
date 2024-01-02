import httpStatus from "http-status-codes";

import {
  type HttpControllerConfig,
  type HttpNext,
  type HttpRequest,
  type HttpResponse,
  type HttpRouter,
  type IHttpRoute,
} from "../../../types/interface";

import {
  authUser,
  changePassword,
  createUser,
  validateToken,
  verifyEmail,
} from "../schema/user";

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
    router
      .route("/verify-email")
      .post(this.validator(verifyEmail), this.verifyEmail.bind(this));
    router
      .route("/validate-token")
      .post(this.validator(validateToken), this.validToken.bind(this));
    router
      .route("/change-password")
      .patch(this.validator(changePassword), this.changePassword.bind(this));
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

  async verifyEmail(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const params = req.body;

      await this.userUseCase.verifyEmail(params);

      return res.sendStatus(httpStatus.OK);
    } catch (error) {
      return next(error);
    }
  }

  async validToken(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const { email, token } = req.body;

      await this.userUseCase.validToken({ email, token });

      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: HttpRequest, res: HttpResponse, next: HttpNext) {
    try {
      const body = req.body;

      await this.userUseCase.changePassword(body);

      return res.sendStatus(httpStatus.NO_CONTENT);
    } catch (error) {
      return next(error);
    }
  }
}
