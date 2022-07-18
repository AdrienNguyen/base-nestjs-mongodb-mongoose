import { PartialType, PickType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
export class SendSignUpEmailInput {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  id: string;

  @IsString()
  template: string;
}

export class SendOtpVerificationEmailInput extends PartialType(
  PickType(SendSignUpEmailInput, ['email', 'template'])
) {
  @IsString()
  code: string;
}

export class SendDeafultEmailInput extends PartialType(
  PickType(SendSignUpEmailInput, ['email', 'template'])
) {}

export class SendRejectCreatorEmailInput extends PartialType(
  PickType(SendSignUpEmailInput, ['email', 'template'])
) {
  @IsString()
  username: string;
  @IsString()
  rejectedReason: string;
}
