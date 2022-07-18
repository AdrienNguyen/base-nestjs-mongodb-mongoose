export interface MailModuleOptions {
  apiKey: string;
  fromEmail: string;
}

export interface EmailVar {
  key: string;
  value: string;
}

export interface SendTemplateOptions {
  template_name: string;
  template_content: Array<any>; // 빈 배열 필수!
  message: {
    to: Array<Recipient>;
    merge_vars: Array<MergeVars>;
    from_email?: string;
    from_name?: string;
  };
}

export interface EmailResponse {
  email: string;
  status: string;
  reject_reason: string | null;
  _id: string;
}

export interface Recipient {
  email: string;
}
export interface Var {
  name: string;
  content: string;
}
export interface MergeVars {
  rcpt: string;
  vars: Array<Var>;
}

export class SendOtpVerificationEmail {
  email: string;
  otp: string;
}
