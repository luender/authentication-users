export type Token = {
  token: string;
  refreshToken: string;
};

export type RefreshToken = {
  email: string;
  expiresIn: number;
  refreshToken: string;
};

export interface IAuthService {
  createRefreshToken(params: RefreshToken): Promise<void>;
}

export interface IAuthRepository {
  createRefreshToken(params: RefreshToken): Promise<void>;
}
