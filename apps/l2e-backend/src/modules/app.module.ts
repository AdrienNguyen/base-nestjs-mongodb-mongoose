import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ActivationCodeModule } from '@activation-codes/activation-code.module';
import { AuthModule } from '@auth/auth.module';
import { UserModule } from '@users/user.module';
import { DatabaseModule } from '@database/database.module';
import { EmailModule } from '@emails/email.module';

@Module({
  imports: [
    ActivationCodeModule,
    AuthModule,
    UserModule,
    DatabaseModule,
    EmailModule.forRoot({
      apiKey: process.env.MAILDRILL_API_KEY,
      fromEmail: process.env.MAILDRILL_FROM_EMAIL,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
