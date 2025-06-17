import SendGridClient, { MailDataRequired } from '@sendgrid/mail';
import { EnvLoader } from '../env/env.loader';
import logger from '../logger';
import {
  ActivationOrgEmailProps,
  DeactivateOrgType,
  DeleteOrgSendEmailProps,
  EmailDetail,
  RemindersEmailProps,
  RemoveUserProps,
  UserTaggedDetail,
} from '../interfaces';

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
      logger?.error(`Error While sending email ${e}`);
    }
    return false;
  }

  async orgDeactivationEmail(emailDetail: DeactivateOrgType): Promise<boolean> {
    const { orgName, type, userEmail, userName, supportEmail } = emailDetail;
    const sendgridMessage: MailDataRequired = {
      to: userEmail,
      from: EmailService.instance.from,
      templateId: EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
      dynamicTemplateData: {
        userName,
        orgName,
        supportEmail,
      },
    };
    try {
      await SendGridClient.send(sendgridMessage);
      logger?.info(
        `Deactivation email sent successfully to ${userEmail} for organization ${orgName}`,
      );
      return true;
    } catch (error) {
      logger?.error(
        `Failed to send deactivation email to ${userEmail} for organization  ${orgName}: ${error} `,
      );
      throw new Error(`While deactivating the org ${error}`);
    }
  }

  async orgActivation(emailDetail: ActivationOrgEmailProps): Promise<boolean> {
    const { dashboardLink, orgName, type, userEmail, userName } = emailDetail;
    const sendgridMessage: MailDataRequired = {
      from: EmailService.instance.from,
      to: userEmail,
      templateId: EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
      dynamicTemplateData: {
        userName,
        orgName,
        dashboardLink,
      },
    };
    try {
      await SendGridClient.send(sendgridMessage);
      logger?.info(
        `Activation email sent successfully to ${userEmail} for organization ${orgName}`,
      );
      return true;
    } catch (error) {
      logger?.error(`iled to activate Org:${error}`);
      throw new Error(`Filed to activate Org:${error}`);
    }
  }

  async deleteOrgEmail(params: DeleteOrgSendEmailProps): Promise<boolean> {
    const { orgName, supportEmail, type, userEmail, userName } = params;
    const sendgridMessage: MailDataRequired = {
      to: userEmail,
      from: this.from,
      templateId: EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
      dynamicTemplateData: {
        orgName,
        userName,
        supportEmail,
      },
    };
    try {
      await SendGridClient.send(sendgridMessage);
      logger?.info(
        `Deleting Org email sent successfully to ${userEmail} for organization ${orgName}`,
      );
      return true;
    } catch (error) {
      logger?.error(
        `Failed to send delete org email to ${userEmail} for organization  ${orgName}:${error}`,
      );
      throw new Error(`While sending email for deleting org`);
    }
  }

  //Project removal email
  async removeUserFromProject(
    removeserPops: RemoveUserProps,
  ): Promise<boolean> {
    const { userEmail, userName, projectName, orgName, type } = removeserPops;

    const sendgridMessage: MailDataRequired = {
      to: userEmail,
      from: this.from,
      templateId: EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
      dynamicTemplateData: {
        userName,
        projectName,
        orgName,
      },
      subject: `You've been removed from ${projectName}`,
    };

    try {
      await SendGridClient.send(sendgridMessage);
      logger?.info(`Project removal email sent to ${userName}.`);
      return true;
    } catch (error: any) {
      logger?.error(
        `Failed to send project removal email to ${userEmail} for project ${projectName}: ${error.message}`,
      );
      throw new Error(
        `Error sending removal email to ${userEmail} for project ${projectName}`,
      );
    }
  }

  async reminders(emailProps: RemindersEmailProps): Promise<boolean> {
    const { dashboardLink, taskCount, type, userEmail, userName } = emailProps;
    const sendgridMessage: MailDataRequired = {
      from: this.from,
      to: userEmail,
      templateId: EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
      dynamicTemplateData: {
        dashboardLink,
        taskCount,
        userName,
      },
    };
    try {
      await SendGridClient.send(sendgridMessage);
      logger?.info(`✅ Reminder email sent successfully to user: ${userEmail}`);
      return true;
    } catch (error) {
      logger?.error(`While sending reminder:${error}`);
      throw new Error(`Field to send reminder`);
    }
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
    const sendgridMessage = {
      from: ProjectEmailService?.instance.from,
      templateId: EnvLoader.getOrThrow(`${taggedData?.type}_TEMPLATE_ID`),
      personalizations: taggedData.userDetail.map((user) => ({
        to: user.email,
        dynamicTemplateData: {
          user_name: user.name,
          item_name: taggedData.item_name,
          mentioner_name: taggedData.mentioner_name,
          mention_url: taggedData.mention_url,
          message: taggedData.message,
          item_type: taggedData.item_type,
          item_uid: taggedData.item_uid,
        },
      })),
    };
    try {
      await SendGridClient.send(sendgridMessage);
      return true;
    } catch (error: any) {
      logger?.error(`Error While sending email ${error}`);
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
