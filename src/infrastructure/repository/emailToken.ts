import e from "cors";
import { ContainerConfig } from "../../types/core";
import { IMysqlAdapter } from "../../types/infrastructure";
import { EmailToken, IEmailTokenService } from "../../types/emailToken";
import nodemailer from "nodemailer";
import R from "ramda";
import Logger from "../../util/logger";

interface Context {
  config: ContainerConfig;
  mysqlAdapter: IMysqlAdapter;
}

export class EmailTokenRepository implements IEmailTokenService {
  private readonly mysqlAdapter: IMysqlAdapter;

  constructor({ mysqlAdapter }: Context) {
    this.mysqlAdapter = mysqlAdapter;
    this.mysqlAdapter.tableName = "emailToken";
  }

  async createEmailToken(params: EmailToken): Promise<void> {
    await this.mysqlAdapter.db.insert({
      email: params.email,
      token: params.token,
      validated: params.validated,
      attempts: params.attempts,
    });
  }

  async checkEmailToken(
    params: Pick<EmailToken, "email">
  ): Promise<EmailToken> {
    const emailToken = await this.mysqlAdapter.db.where({
      email: params.email,
    });

    const verify = R.isEmpty(emailToken)
      ? null
      : {
          id: emailToken[0].id,
          email: emailToken[0].email,
          token: emailToken[0].token,
          validated: emailToken[0].validated === 1 ? true : false,
          attempts: emailToken[0].attempts,
        };

    return verify;
  }

  async deleteEmailToken(params: Pick<EmailToken, "email">): Promise<void> {
    await this.mysqlAdapter.db
      .where({
        email: params.email,
      })
      .delete();
  }

  async sendEmailToken(params: EmailToken): Promise<void> {
    const { email, token } = params;

    const transporter = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: parseInt(process.env.NODEMAILER_PORT),
      secure: true,
      auth: {
        user: process.env.NODEMAILER_AUTH_USER,
        pass: process.env.NODEMAILER_AUTH_PASS,
      },
    });

    await transporter
      .sendMail({
        from: process.env.NODEMAILER_AUTH_USER,
        to: email,
        subject: "Verificação de posse de e-mail",
        text: `Esse é seu token de validação: ${token}`,
        html: `<p>Esse é seu token de validação: ${token}</p>`,
      })
      .then(() => Logger.debug("E-mail enviado com sucesso"))
      .catch((err) => Logger.debug(err));
  }

  async updateEmailToken(params: Partial<EmailToken>): Promise<void> {
    await this.mysqlAdapter.db
      .where({ email: params.email })
      .update({ validated: params.validated });
  }

  async updateAttemptsEmailToken(params: Partial<EmailToken>): Promise<void> {
    await this.mysqlAdapter.db.where({ email: params.email }).update({
      attempts: params.attempts,
    });
  }
}
