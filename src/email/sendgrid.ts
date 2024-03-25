import SendGridClient from '@sendgrid/mail';
import { EnvLoader } from '../env/env.loader';

export enum EmailType {
  FIREBASE_VERIFY = 'FIREBASE_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
}

export interface EmailDetail {
  to: string;
  type: EmailType;
  message: Record<string, string>;
}

export class EmailService {
  static instance: EmailService;

  apiKey = EnvLoader.getOrThrow('SENDGRID_KEY');

  from = EnvLoader.getOrThrow('EMAIL_FROM');

  async sendEmail(emailDetail: EmailDetail): Promise<boolean> {
    const sendgridMessage: SendGridClient.MailDataRequired = {
      from: EmailService.instance.from,
      templateId: EnvLoader.getOrThrow(`${emailDetail.type}_TEMPLATE_ID`),
      personalizations: [
        {
          to: emailDetail.to,
          dynamicTemplateData: emailDetail.message,
        },
      ],
    };

    try {
      await SendGridClient.send(sendgridMessage);
      // TODO: Retry mechanism
      return true;
    } catch (e) {
      console.log(e);
      //   logger.error(`Error While sending email ${e}`);
    }
    return false;
  }

  static getInstance() {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
      SendGridClient.setApiKey(EmailService.instance.apiKey);
    }
    return EmailService.instance;
  }
}
