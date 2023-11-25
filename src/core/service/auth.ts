import { IAuthService, RefreshToken } from "../../types/auth";
import { ServiceContext } from "../../types/core";

export class AuthService implements IAuthService {
  private readonly authRepository: ServiceContext["authRepository"];

  constructor(ctx: ServiceContext) {
    this.authRepository = ctx.authRepository;
  }

  async createRefreshToken(params: RefreshToken): Promise<void> {
    await this.authRepository.createRefreshToken(params);
  }
}
