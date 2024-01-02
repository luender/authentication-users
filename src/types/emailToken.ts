export type EmailToken = {
  email: string;
  token: string;
  validated?: boolean;
  attempts?: number;
};

export interface IEmailTokenService {
  createEmailToken(params: EmailToken): Promise<void>;

  checkEmailToken(params: Pick<EmailToken, "email">): Promise<EmailToken>;

  deleteEmailToken(params: Pick<EmailToken, "email">): Promise<void>;

  sendEmailToken(params: EmailToken): Promise<void>;

  updateEmailToken(params: Partial<EmailToken>): Promise<void>;

  updateAttemptsEmailToken(params: Partial<EmailToken>): Promise<void>;
}

export interface IEmailTokenRepository {
  createEmailToken(params: EmailToken): Promise<void>;

  checkEmailToken(params: Pick<EmailToken, "email">): Promise<EmailToken>;

  deleteEmailToken(params: Pick<EmailToken, "email">): Promise<void>;

  sendEmailToken(params: EmailToken): Promise<void>;

  updateEmailToken(params: Partial<EmailToken>): Promise<void>;

  updateAttemptsEmailToken(params: Partial<EmailToken>): Promise<void>;
}
