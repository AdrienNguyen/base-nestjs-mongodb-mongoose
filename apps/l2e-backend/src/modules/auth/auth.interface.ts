import { User } from '@users/schemas';

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  userData: User;
}

export interface GenerateAccessJWTData {
  accessToken: string;
}

export interface LoginByOtpData {
  otpSent: boolean;
}
