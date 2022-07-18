import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsMongoId, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    example: 'phuong.na163228@gmail.com',
  })
  email: string;

  @IsMongoId()
  @IsNotEmpty()
  @IsOptional()
  @ApiProperty({
    example: '62cedc5f1be22cdb59022d5e',
  })
  activationCode: string;
}
