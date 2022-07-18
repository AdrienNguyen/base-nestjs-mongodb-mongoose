import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendOtpDto {
  @IsEmail()
  @ApiProperty({
    example: 'phuong.na163228@gmail.com',
  })
  email: string;
}
