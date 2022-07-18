import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  LoginByOtpDto,
  LoginByPasswordDto,
  RefreshTokenDto,
  ConfirmOtpDto,
  ResendOtpDto,
  ActiveActivationCodeDto,
} from '@auth/dtos';
import { AuthService } from '@auth/auth.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login-by-password')
  @HttpCode(HttpStatus.OK)
  async loginByPassword(@Body() loginByPasswordDto: LoginByPasswordDto) {
    const loginData = await this.authService.loginByPassword(
      loginByPasswordDto
    );
    return {
      success: true,
      content: loginData,
    };
  }

  @Post('login-by-otp')
  @HttpCode(HttpStatus.OK)
  async loginByOtp(@Body() loginByOtpDto: LoginByOtpDto) {
    const loginData = await this.authService.loginByOtp(loginByOtpDto);
    return {
      success: true,
      content: loginData,
    };
  }

  @Post('login-by-otp/confirm-otp')
  @HttpCode(HttpStatus.OK)
  async confirmEmailLoginOtp(@Body() confirmOtpDto: ConfirmOtpDto) {
    const confirmData = await this.authService.confirmEmailLoginOtp(
      confirmOtpDto
    );
    return {
      success: true,
      content: confirmData,
    };
  }

  @Post('active-activation-code')
  @HttpCode(HttpStatus.CREATED)
  async activeActivationCode(
    @Body() activeActivationCodeDto: ActiveActivationCodeDto
  ) {
    const activeData = await this.authService.activeActivationCode(
      activeActivationCodeDto
    );
    return {
      success: true,
      content: activeData,
    };
  }

  @Post('login-by-otp/resend-otp')
  @HttpCode(HttpStatus.OK)
  async resendEmailLoginOtp(@Body() resendOtpDto: ResendOtpDto) {
    const resendData = await this.authService.resendEmailLoginOtp(resendOtpDto);
    return {
      success: true,
      content: resendData,
    };
  }

  @Post('refresh-token')
  @HttpCode(HttpStatus.CREATED)
  async generateNewAccessJWT(@Body() refreshTokenDto: RefreshTokenDto) {
    const newAccessToken = await this.authService.generateNewAccessJWT(
      refreshTokenDto
    );
    return {
      success: true,
      content: newAccessToken,
    };
  }
}
