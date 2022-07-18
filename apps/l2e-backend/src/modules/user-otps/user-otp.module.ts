import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserOtp, UserOtpSchema } from '@user-otps/schemas';
import { UserOtpService } from '@user-otps/user-otp.service';

const UsersOtpModel = MongooseModule.forFeature([
  { name: UserOtp.name, schema: UserOtpSchema },
]);

@Module({
  imports: [UsersOtpModel],
  providers: [UserOtpService],
  exports: [UserOtpService, UsersOtpModel],
})
export class UserOtpModule {}
