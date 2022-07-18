import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@users/schemas';
import { UserController } from '@users/user.controller';
import { UserService } from '@users/user.service';

const UserModel = MongooseModule.forFeature([
  {
    name: User.name,
    schema: UserSchema,
  },
]);

@Module({
  imports: [UserModel],
  exports: [UserService, UserModel],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
