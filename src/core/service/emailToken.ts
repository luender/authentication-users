import { ServiceContext } from "../../types/core";
import { EmailToken, IEmailTokenService } from "../../types/emailToken";

export class EmailTokenService implements IEmailTokenService {
  private readonly emailTokenRepository: ServiceContext["emailTokenRepository"];

  constructor(ctx: ServiceContext) {
    this.emailTokenRepository = ctx.emailTokenRepository;
  }

  async createEmailToken(params: EmailToken): Promise<void> {
    await this.emailTokenRepository.createEmailToken(params);
  }

  async checkEmailToken(
    params: Pick<EmailToken, "email">
  ): Promise<EmailToken> {
    const emailToken = await this.emailTokenRepository.checkEmailToken({
      email: params.email,
    });

    return emailToken;
  }

  async deleteEmailToken(params: Pick<EmailToken, "email">): Promise<void> {
    await this.emailTokenRepository.deleteEmailToken(params);
  }

  async sendEmailToken(params: EmailToken): Promise<void> {
    await this.emailTokenRepository.sendEmailToken(params);
  }

  async updateEmailToken(params: Partial<EmailToken>): Promise<void> {
    await this.emailTokenRepository.updateEmailToken(params);
  }

  async updateAttemptsEmailToken(params: Partial<EmailToken>): Promise<void> {
    await this.emailTokenRepository.updateAttemptsEmailToken(params);
  }
}
