import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from '@users/dtos';
import { User, UserDocument } from '@users/schemas';
import { hashPassword } from '@src/cores/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>
  ) {}

  getData(): { message: string } {
    return { message: 'Welcome to l2e-backend - userservice!' };
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const existedUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existedUser) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    const createdUser: UserDocument = await this.userModel.create(
      createUserDto
    );
    return createdUser;
  }

  async update(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = await this.userModel.findById(userId);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (updateUserDto.password) {
      const encryptedPassword = await hashPassword(updateUserDto.password);
      updateUserDto.password = encryptedPassword;
    }

    const updatedUser: User = await this.userModel
      .findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $set: updateUserDto,
        },
        {
          new: true,
        }
      )
      .select('-password');

    if (!updatedUser) {
      throw new HttpException(
        'Something went wrong. Cannot update user',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }

    return updatedUser;
  }

  async getActiveUser(email: string): Promise<UserDocument | null> {
    const user = await this.userModel.findOne({ email });
    if (!user || !user.activationCode) {
      return null;
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    return user;
  }
}
