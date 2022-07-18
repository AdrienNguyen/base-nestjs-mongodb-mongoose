import { Inject, Injectable } from '@nestjs/common';
import {
  MailModuleOptions,
  SendOtpVerificationEmail,
} from '@emails/email.interface';
import Mailchimp from '@mailchimp/mailchimp_transactional/src/index.js';
import axios, { AxiosRequestConfig } from 'axios';
import {
  SendSignUpEmailInput,
  SendOtpVerificationEmailInput,
  SendRejectCreatorEmailInput,
} from '@emails/dtos/email.dto';
import { CONFIG_OPTIONS } from '@emails/email.constant';

@Injectable()
export class EmailService {
  private mailchimp: Mailchimp.ApiClient;
  private readonly senderName = 'Label Team';
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: MailModuleOptions
  ) {
    this.mailchimp = Mailchimp(this.options.apiKey);
  }

  request(config: AxiosRequestConfig) {
    return axios.request({
      url: 'https://mandrillapp.com/api/1.0' + config.url,
      method: config.method,
      data: Object.assign({}, config.data, { key: this.options.apiKey }),
    });
  }

  sendSignUpEmail({ id, email, name, template }: SendSignUpEmailInput) {
    const vars = [
      { name: 'EMAIL', content: email },
      { name: 'USER_ID', content: id },
      { name: 'USER_NAME', content: name },
    ];

    this.mailchimp.messages.sendTemplate({
      template_name: template,
      template_content: [],
      message: {
        to: [
          {
            email,
            name,
            type: 'to',
          },
        ],
        merge_vars: [
          {
            rcpt: email,
            vars,
          },
        ],
        from_email: this.options.fromEmail,
        from_name: this.senderName,
      },
    });
  }

  sendVerificationEmail({
    email,
    template,
    code,
  }: SendOtpVerificationEmailInput) {
    const vars = [
      { name: 'EMAIL', content: email },
      { name: 'OTP_VALUE', content: code },
    ];
    this.mailchimp.messages.sendTemplate({
      template_name: template,
      template_content: [],
      message: {
        to: [
          {
            email,
            type: 'to',
          },
        ],
        merge_vars: [
          {
            rcpt: email,
            vars,
          },
        ],
        from_email: this.options.fromEmail,
        from_name: this.senderName,
      },
    });
  }

  sendCreatorRequestRejectEmail({
    email,
    username,
    rejectedReason,
    template = 'label-creator-request-reject',
  }: SendRejectCreatorEmailInput) {
    const vars = [
      { name: 'USER_NAME', content: username },
      { name: 'rejectedReason', content: rejectedReason },
    ];
    this.mailchimp.messages.sendTemplate({
      template_name: template,
      template_content: [],
      message: {
        to: [
          {
            email,
            type: 'to',
          },
        ],
        merge_vars: [
          {
            rcpt: email,
            vars,
          },
        ],
        from_email: this.options.fromEmail,
        from_name: this.senderName,
      },
    });
  }

  sendOtpVerificationEmail({ otp, email }: SendOtpVerificationEmail) {
    const template = 'label-market-verificationcode';
    const vars = [{ name: 'OTP_VALUE', content: otp }];

    this.mailchimp.messages.sendTemplate({
      template_name: template,
      template_content: [],
      message: {
        to: [{ email, type: 'to' }],
        merge_vars: [{ rcpt: email, vars }],
        from_email: this.options.fromEmail,
        from_name: this.senderName,
      },
    });
  }
}
