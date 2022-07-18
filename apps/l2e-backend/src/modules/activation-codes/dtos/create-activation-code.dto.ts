import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsMongoId, Length } from 'class-validator';

export class CreateActivationCodeDto {
  @IsString()
  @Length(6)
  @ApiProperty({
    example: '123456',
  })
  code: string;

  @IsMongoId()
  @IsNotEmpty()
  @ApiProperty({
    example: '62cedc5f1be22cdb59022d5e',
  })
  owner: string;
}
