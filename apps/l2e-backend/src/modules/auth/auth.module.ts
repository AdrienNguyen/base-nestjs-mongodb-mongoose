import { Module } from '@nestjs/common';
import { AuthController } from '@auth/auth.controller';
import { AuthService } from '@auth/auth.service';
import { UserModule } from '@users/user.module';
import { UserOtpModule } from '@user-otps/user-otp.module';
import { ActivationCodeModule } from '@activation-codes/activation-code.module';

@Module({
  imports: [UserModule, UserOtpModule, ActivationCodeModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
