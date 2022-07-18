import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class LoginByOtpDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'phuong.na163228@gmail.com',
  })
  email: string;
}
