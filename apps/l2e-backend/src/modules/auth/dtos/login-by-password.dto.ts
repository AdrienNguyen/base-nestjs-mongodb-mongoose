import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class LoginByPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'phuong.na163228@gmail.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'labell2e@',
  })
  password: string;
}
