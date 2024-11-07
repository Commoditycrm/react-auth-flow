import SendGridClient from '@sendgrid/mail';
import { EnvLoader } from '../env/env.loader';

export enum EmailType {
  FIREBASE_VERIFY = 'FIREBASE_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
  INVITE_USER = 'INVITE_USER',
  TAGGING_USER = 'TAGGING_USER',
}

export interface EmailDetail {
  to: string;
  type: EmailType;
  message: Record<string, string>;
}

export interface UserTaggedDetail extends EmailDetail {
  user_name: string;
  mentioner_name: string;
  item_name: string;
  mention_url: string;
  email:string
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
    } catch (e: any) {
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

export class ProjectEmailService {
  static instance: ProjectEmailService;

  apiKey = EnvLoader.getOrThrow('SENDGRID_KEY');

  from = EnvLoader.getOrThrow('EMAIL_FROM');
  async sendProjectEmail(taggedData: UserTaggedDetail): Promise<boolean> {
    const sendgridMessage: SendGridClient.MailDataRequired = {
      from: ProjectEmailService?.instance.from,
      templateId: EnvLoader.getOrThrow(`${taggedData?.type}_TEMPLATE_ID`),
      to: taggedData.to,
      dynamicTemplateData: {
        user_name: taggedData.user_name,
        item_name: taggedData.item_name,
        mentioner_name: taggedData.mentioner_name,
        mention_url: taggedData.mention_url,
        mention_text: taggedData?.message,
      },
    };
    try {
      await SendGridClient.send(sendgridMessage);
      return true;
    } catch (error: any) {
      //   logger.error(`Error While sending email ${e}`);
    }
    return false;
  }

  static getInstance() {
    if (!ProjectEmailService.instance) {
      ProjectEmailService.instance = new ProjectEmailService();
      SendGridClient.setApiKey(ProjectEmailService.instance.apiKey);
    }
    return ProjectEmailService.instance;
  }
}
