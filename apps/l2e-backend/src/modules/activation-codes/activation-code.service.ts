import { Body, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '@users/schemas';
import { CreateActivationCodeDto } from '@activation-codes/dtos';
import {
  ActivationCode,
  ActivationCodeDocument,
} from '@activation-codes/schemas';

@Injectable()
export class ActivationCodeService {
  constructor(
    @InjectModel(ActivationCode.name)
    private readonly activationCodeModel: Model<ActivationCodeDocument>,
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  async create(
    @Body() createActivationCodeDto: CreateActivationCodeDto
  ): Promise<ActivationCode> {
    const user = await this.userModel.findById(createActivationCodeDto.owner);
    if (!user) {
      throw new HttpException('Owner does not exist', HttpStatus.NOT_FOUND);
    }

    let createdActivationCode: ActivationCode;
    try {
      createdActivationCode = await this.activationCodeModel.create(
        createActivationCodeDto
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return createdActivationCode;
  }

  async getAll(): Promise<ActivationCode[]> {
    const allActivationCodes: ActivationCode[] = await this.activationCodeModel
      .find()
      .populate({
        path: 'owner',
      });

    return allActivationCodes;
  }

  async getActivationCodebyCode(code: string): Promise<ActivationCodeDocument> {
    const activationCode = await this.activationCodeModel.findOne({
      code,
    });
    return activationCode;
  }
}
