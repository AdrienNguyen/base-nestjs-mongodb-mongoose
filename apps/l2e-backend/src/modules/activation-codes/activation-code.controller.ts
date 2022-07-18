import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ActivationCodeService } from '@activation-codes/activation-code.service';
import { CreateActivationCodeDto } from '@activation-codes/dtos';

@Controller('activation-codes')
@ApiTags('activation-codes')
export class ActivationCodeController {
  constructor(private readonly activationCodeService: ActivationCodeService) {}

  @Post()
  async create(@Body() CreateActivationCodeDto: CreateActivationCodeDto) {
    const createActivationCode = await this.activationCodeService.create(
      CreateActivationCodeDto
    );
    return {
      success: true,
      content: createActivationCode,
    };
  }

  @Get()
  getAll() {
    return this.activationCodeService.getAll();
  }
}
