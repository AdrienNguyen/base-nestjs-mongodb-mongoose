import { Injectable } from '@nestjs/common';
import console from 'console';
import { Model } from 'mongoose';
import { UserOtp, UserOtpDocument } from '@user-otps/schemas';
import { InjectModel } from '@nestjs/mongoose';
import { ConfirmOtpDto } from '../auth/dtos/confirm-otp.dto';

@Injectable()
export class UserOtpService {
  constructor(
    @InjectModel(UserOtp.name)
    private readonly userOtpModel: Model<UserOtpDocument>
  ) {}

  generateDigitOtp(): string {
    const optLength = Number(process.env.OTP_LENGTH) || 6;
    const digits = '0123456789';
    let otp = '';

    while (otp.length < optLength) {
      const index = Math.floor(Math.random() * digits.length);
      otp += digits[index];
    }
    return otp;
  }

  getOtpTimeOut(): Date {
    console.log(process.env.OTP_TIMEOUT);
    const optTimeout = Number(process.env.OTP_TIMEOUT) || 1;
    const expiredTime = new Date();
    expiredTime.setMinutes(expiredTime.getMinutes() + optTimeout);
    return expiredTime;
  }

  async findOneAndUpdateOpt(
    email: string,
    otp: string,
    expiredTime: Date
  ): Promise<UserOtp> {
    return await this.userOtpModel.findOneAndUpdate(
      { email },
      { otp, expiredTime },
      {
        upsert: true,
      }
    );
  }

  async findByEmailAndOtp(confirmOtpDto: ConfirmOtpDto): Promise<UserOtp> {
    return await this.userOtpModel.findOne(confirmOtpDto);
  }
}
