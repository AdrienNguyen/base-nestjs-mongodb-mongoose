import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '@users/user.module';
import { ActivationCodeController } from '@activation-codes/activation-code.controller';
import { ActivationCodeService } from '@activation-codes/activation-code.service';
import {
  ActivationCode,
  ActivationCodeSchema,
} from '@activation-codes/schemas';

const ActivationCodeModel = MongooseModule.forFeature([
  {
    name: ActivationCode.name,
    schema: ActivationCodeSchema,
  },
]);

@Module({
  imports: [ActivationCodeModel, UserModule],
  exports: [ActivationCodeService],
  controllers: [ActivationCodeController],
  providers: [ActivationCodeService],
})
export class ActivationCodeModule {}
