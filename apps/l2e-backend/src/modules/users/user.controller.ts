import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserService } from '@users/user.service';
import { CreateUserDto, UpdateUserDto } from '@users/dtos';
import { JwtAuthGuard } from '@cores/guards/jwt-auth.guard';

@Controller('users')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getData() {
    return this.userService.getData();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    const createdUser = await this.userService.create(createUserDto);

    return {
      success: true,
      content: createdUser,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const updatedUser = await this.userService.update(userId, updateUserDto);

    return {
      success: true,
      content: updatedUser,
    };
  }
}
