import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class ActiveActivationCodeDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'phuong.na163228@gmail.com',
  })
  email: string;

  @IsNumberString()
  @IsNotEmpty()
  @Length(6)
  @ApiProperty({
    example: '123456',
  })
  activationCode: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: 'labell2e@',
  })
  password: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(6)
  @IsOptional()
  @ApiProperty({
    example: '123456',
  })
  otp: string;
}
