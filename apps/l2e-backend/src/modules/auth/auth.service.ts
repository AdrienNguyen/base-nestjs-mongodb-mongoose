import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ActiveActivationCodeDto,
  LoginByOtpDto,
  LoginByPasswordDto,
  RefreshTokenDto,
  ResendOtpDto,
} from '@auth/dtos';
import { User, UserDocument } from '@users/schemas';
import {
  generateAccessJWT,
  generateRefreshJWT,
  verifyRefreshJWT,
} from '@cores/utils/jwt';
import { comparePassword } from '@src/cores/utils/bcrypt';
import {
  GenerateAccessJWTData,
  LoginByOtpData,
  LoginResponseData,
} from '@auth/auth.interface';
import { UserOtpService } from '@user-otps/user-otp.service';
import { EmailService } from '@emails/email.service';
import { ConfirmOtpDto } from '@auth/dtos';
import { UserService } from '@users/user.service';
import { ActivationCodeService } from '@activation-codes/activation-code.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    private readonly userOtpService: UserOtpService,
    private readonly emailService: EmailService,
    private readonly userService: UserService,
    private readonly activationCodeService: ActivationCodeService
  ) {}

  async loginByPassword(
    loginByPasswordDto: LoginByPasswordDto
  ): Promise<LoginResponseData> {
    const user = await this.userModel.findOne({
      email: loginByPasswordDto.email,
    });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (!user.activationCode) {
      throw new HttpException(
        'User is not active with activation code. Please try again',
        HttpStatus.FORBIDDEN
      );
    }

    const checkPassword = await comparePassword(
      loginByPasswordDto.password,
      user.password
    );
    if (!checkPassword) {
      throw new HttpException(
        'Invalid credentials. Please try again',
        HttpStatus.FORBIDDEN
      );
    }

    return this.generateResponseLoginData(user);
  }

  generateResponseLoginData(user: UserDocument): LoginResponseData {
    let accessToken;
    let refreshToken;
    let userData;
    try {
      userData = user.toObject();
      delete userData.password;
      accessToken = generateAccessJWT(userData, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
      });
      refreshToken = generateRefreshJWT(userData, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    return {
      userData,
      accessToken,
      refreshToken,
    };
  }

  async loginByOtp(loginByOtpDto: LoginByOtpDto): Promise<LoginByOtpData> {
    const { email } = loginByOtpDto;

    const otp = this.userOtpService.generateDigitOtp();
    const expiredTime = this.userOtpService.getOtpTimeOut();

    await this.userOtpService.findOneAndUpdateOpt(email, otp, expiredTime);

    this.emailService.sendOtpVerificationEmail({ email, otp });
    return {
      otpSent: true,
    };
  }

  async confirmEmailLoginOtp({
    email,
    otp,
  }: ConfirmOtpDto): Promise<LoginResponseData> {
    const userOtp = await this.userOtpService.findByEmailAndOtp({
      otp,
      email,
    });

    if (!userOtp) {
      throw new HttpException(
        'OTP is invalid. Please try again',
        HttpStatus.NOT_FOUND
      );
    }

    if (userOtp.expiredTime < new Date()) {
      throw new HttpException(
        'OTP is expired. Please try again',
        HttpStatus.BAD_REQUEST
      );
    }

    // valid OTP then login or have to request activation code

    const user = await this.userService.getActiveUser(email);

    if (!user) {
      throw new HttpException(
        'User is not active with activation code. Please try again',
        HttpStatus.FORBIDDEN
      );
    }

    return this.generateResponseLoginData(user);
  }

  async resendEmailLoginOtp({ email }: ResendOtpDto): Promise<LoginByOtpData> {
    const otp = this.userOtpService.generateDigitOtp();
    const expiredTime = this.userOtpService.getOtpTimeOut();

    await this.userOtpService.findOneAndUpdateOpt(email, otp, expiredTime);

    this.emailService.sendOtpVerificationEmail({ email, otp });

    return {
      otpSent: true,
    };
  }

  async activeActivationCode(
    activeActivationCodeDto: ActiveActivationCodeDto
  ): Promise<LoginResponseData> {
    const { email, activationCode, otp, password } = activeActivationCodeDto;
    if (!otp && !password) {
      throw new HttpException(
        'Otp or password is required',
        HttpStatus.BAD_REQUEST
      );
    }

    if (otp && password) {
      throw new HttpException(
        'Only otp or password is required',
        HttpStatus.BAD_REQUEST
      );
    }

    if (otp) {
      return await this.activeActivationCodeByOtp({
        email,
        activationCode,
        otp,
      });
    }

    if (password) {
      return await this.activeActivationCodeByPassword({
        email,
        activationCode,
        password,
      });
    }
  }

  async activeActivationCodeByOtp({
    email,
    activationCode,
    otp,
  }): Promise<any> {
    // check otp
    const userOtp = await this.userOtpService.findByEmailAndOtp({
      otp,
      email,
    });

    if (!userOtp) {
      throw new HttpException(
        'OTP is invalid. Please try again',
        HttpStatus.NOT_FOUND
      );
    }

    const currentActivationCode =
      await this.activationCodeService.getActivationCodebyCode(activationCode);

    if (!currentActivationCode) {
      throw new HttpException(
        'Activation code does not exist. Please try again',
        HttpStatus.NOT_FOUND
      );
    }

    if (currentActivationCode.register) {
      throw new HttpException(
        'Activation code is registered. Please try again',
        HttpStatus.BAD_REQUEST
      );
    }

    let user = await this.userModel.findOne({ email });

    if (!user) {
      // create new User with activation code
      user = await this.userModel.create({
        email,
        activationCode: currentActivationCode._id,
      });
    } else {
      // active activation code
      user.activationCode = currentActivationCode._id;
      await user.save();
    }

    currentActivationCode.register = user._id;
    await currentActivationCode.save();

    return this.generateResponseLoginData(user);
  }

  async activeActivationCodeByPassword({
    email,
    activationCode,
    password,
  }): Promise<LoginResponseData> {
    // check password
    const user = await this.userModel.findOne({
      email,
    });

    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const checkPassword = await comparePassword(password, user.password);
    if (!checkPassword) {
      throw new HttpException(
        'Invalid credentials. Please try again',
        HttpStatus.FORBIDDEN
      );
    }

    const currentActivationCode =
      await this.activationCodeService.getActivationCodebyCode(activationCode);

    if (!currentActivationCode) {
      throw new HttpException(
        'Activation code does not exist. Please try again',
        HttpStatus.NOT_FOUND
      );
    }

    if (currentActivationCode.register) {
      throw new HttpException(
        'Activation code is registered. Please try again',
        HttpStatus.BAD_REQUEST
      );
    }

    // active activation code
    user.activationCode = currentActivationCode._id;
    await user.save();

    currentActivationCode.register = user._id;
    await currentActivationCode.save();

    return this.generateResponseLoginData(user);
  }

  async generateNewAccessJWT(
    refreshTokenDto: RefreshTokenDto
  ): Promise<GenerateAccessJWTData> {
    const refreshToken = refreshTokenDto.refreshToken;

    let payload;
    try {
      payload = await verifyRefreshJWT(refreshToken);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }

    const accessToken = generateAccessJWT(payload);

    return { accessToken };
  }
}
