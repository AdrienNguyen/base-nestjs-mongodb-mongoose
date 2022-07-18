import { DynamicModule, Global, Module } from '@nestjs/common';
import { CONFIG_OPTIONS } from '@emails/email.constant';
import { MailModuleOptions } from '@emails/email.interface';
import { EmailService } from '@emails/email.service';

@Module({})
@Global()
export class EmailModule {
  static forRoot(options: MailModuleOptions): DynamicModule {
    return {
      module: EmailModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        EmailService,
      ],
      exports: [EmailService],
    };
  }
}
