import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class ConfirmOtpDto {
  @IsEmail()
  @ApiProperty({
    example: 'phuong.na163228@gmail.com',
  })
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  @ApiProperty({
    example: '123456',
  })
  otp: string;
}
