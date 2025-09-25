import { Body, JsonController, Post } from 'routing-controllers';
import * as sendgrid from '../email/sendgrid';
import { EnvLoader } from '../env/env.loader';
import { FirebaseFunctions } from '../functions/firebase';
import { ActionCodeSettings } from 'firebase/auth';
import jwt from 'jsonwebtoken';
import logger from '../logger';
import {
  EmailDetail,
  EmailType,
  RemindersEmailProps,
  type RemindersType,
  type UserTaggedDetail,
} from '../interfaces';

@JsonController('/users')
export class FirebaseUserController {
  emailService: sendgrid.EmailService;
  projectEmailService: sendgrid.ProjectEmailService;
  waService: sendgrid.WhatsAppService;

  constructor() {
    this.emailService = sendgrid.EmailService.getInstance();
    this.projectEmailService = sendgrid.ProjectEmailService.getInstance();
    this.waService = sendgrid.WhatsAppService.getInstance();
  }

  @Post('/')
  async createUser(
    @Body()
    user: {
      email: string;
      name: string;
      password: string;
      photoURL: string;
      phoneNumber: string;
    },
  ) {
    const { email, password, name, phoneNumber } = user;

    logger?.info(`Processing request for : ${email}`);

    const verifyLink = await FirebaseFunctions.getInstance().createUser({
      email: email?.trim(),
      password,
      name,
      phoneNumber,
    });
    const expirationTime = new Date(Date.now() + 3600 * 1000).toISOString();

    const emailDetail: EmailDetail = {
      to: email,
      type: EmailType.FIREBASE_VERIFY,
      message: {
        verifyLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    logger?.info(`Email sent for: ${email}`);
    return { success: true, link: verifyLink, expiresAt: expirationTime };
  }

  @Post('/resend-verification')
  async resendVerificationLink(
    @Body()
    reqBody: {
      email: string;
      link: string;
    },
  ) {
    const { email, link } = reqBody;
    if (!email) {
      throw new Error('Input Validation Error');
    }

    logger?.info(`Processing request for : ${email} with locale: ${link}`);

    const verifyLink =
      link ||
      (await FirebaseFunctions.getInstance().generateVerificationLink(
        email?.trim(),
      ));

    const emailDetail: EmailDetail = {
      to: email,
      type: EmailType.FIREBASE_VERIFY,
      message: {
        verifyLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    logger?.info(`Email sent for: ${email}`);
    return { success: true };
  }

  @Post('/password-reset')
  async resetPassword(@Body() passwordRestBody: { email: string }) {
    const { email } = passwordRestBody;

    const url = `${EnvLoader.getOrThrow('BASE_URL')}/reset_password`;

    const actionCodeSettings: ActionCodeSettings = {
      url,
      handleCodeInApp: true,
    };

    if (!email) {
      throw new Error('Input Validation Error');
    }
    // logger.info(`Processing request for : ${email} with locale: ${locale}`);

    const resetPasswordLink =
      await FirebaseFunctions.getInstance().resetPassword(
        email.trim(),
        actionCodeSettings,
      );

    const emailDetail: EmailDetail = {
      to: email,
      type: EmailType.PASSWORD_RESET,
      message: {
        resetPasswordLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    logger?.info(`Email sent for: ${email}`);

    return { success: true };
  }

  @Post('/invite-user')
  async inviteUser(
    @Body()
    inviteUser: {
      inviteeEmail: string;
      email: string;
      companyId: string;
    },
  ) {
    const { inviteeEmail, email, companyId } = inviteUser;

    if (!inviteeEmail || !email || !companyId) {
      throw new Error('Input Validation Error');
    }

    const userExists = await FirebaseFunctions.getInstance().getUserByEmail(
      email,
    );

    let invitedUserExists = null;
    try {
      invitedUserExists = await FirebaseFunctions.getInstance().getUserByEmail(
        inviteeEmail,
      );
    } catch (error) {
      if ((error as any).code !== 'auth/user-not-found') {
        throw error; // rethrow if it's a different error
      }
    }

    if (!userExists) throw new Error('Unauthorized Request!');
    // logger.info(`Processing request for : ${email} with locale: ${locale}`);

    if (invitedUserExists) {
      throw new Error('User already exists');
    }
    const token = jwt.sign(
      {
        inviteeEmail,
        orgId: companyId,
        role: 'invitee',
        sub: inviteeEmail,
      },
      process.env.INVITE_JWT_SECRET!,
      { expiresIn: '1d' },
    );

    const invitationLink = `${EnvLoader.getOrThrow(
      'BASE_URL',
    )}/invite?token=${token}`;

    const emailDetail: EmailDetail = {
      to: inviteeEmail,
      type: EmailType.INVITE_USER,
      message: {
        invitationLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    logger?.info(`Invited Email sent for: ${email}`);

    return { success: true, token };
  }

  @Post('/tag_user')
  async tagUser(
    @Body()
    taggedData: UserTaggedDetail,
  ) {
    const {
      mention_url,
      item_name,
      mentioner_name,
      email,
      userDetail,
      message,
      item_type,
      projectName,
    } = taggedData;
    if (
      !mention_url ||
      !item_name ||
      !mentioner_name ||
      !email ||
      !userDetail ||
      !message ||
      !item_type ||
      !projectName
    ) {
      throw new Error('Input Validation Error');
    }
    const url = `${EnvLoader.getOrThrow(
      'BASE_URL',
    )}/${mention_url}?redirect=true`;

    const useEmailDetail: UserTaggedDetail = {
      ...taggedData,
      type: EmailType.TAGGING_USER,
      mention_url: url,
    };
    const userExists = await FirebaseFunctions.getInstance().getUserByEmail(
      email,
    );
    if (!userExists) throw new Error('Unauthorized Request!');

    await this.projectEmailService.sendProjectEmail(useEmailDetail);
    try {
      const comment: string = JSON.stringify(message);
      const contentSid = EnvLoader.getOrThrow('TWILIO_WA_TAG_USER');

      const targets = userDetail.filter((u) => !!u.phoneNumber);

      if (targets.length === 0) {
        logger?.warn(
          `No WhatsApp phone; skipped WA send for item ${item_name}`,
        );
      } else {
        const sends = targets.map((t) =>
          this.waService.sendTemplate({
            to: t.phoneNumber,
            contentSid,
            variables: {
              '1': t.name,
              '2': mentioner_name,
              '3': projectName,
              '4': item_name,
              '5': comment,
              '6': url,
            },
          }),
        );

        const results = await Promise.allSettled(sends);
        const ok = results.filter((r) => r.status === 'fulfilled').length;
        const fail = results.length - ok;
        logger?.info(
          `WhatsApp task assignment for item ${item_name}: sent=${ok}, failed=${fail}`,
        );

        results.forEach((r) => {
          if (r.status === 'rejected') {
            const e: any = r.reason;
            logger?.error(`WA error ${e?.code ?? ''}: ${e?.message ?? e}`);
          }
        });
      }
    } catch (waErr: any) {
      logger?.error(`WhatsApp send failed: ${waErr?.message ?? waErr}`);
    }
    return { success: true };
  }

  @Post('/assign')
  async assignUser(@Body() taggedData: UserTaggedDetail) {
    const {
      mention_url,
      item_name,
      mentioner_name,
      email,
      userDetail,
      item_type,
      projectName,
      item_uid,
    } = taggedData;

    if (
      !mention_url ||
      !item_name ||
      !mentioner_name ||
      !email ||
      !userDetail ||
      !item_type ||
      !projectName
    ) {
      throw new Error('Input Validation Error');
    }

    const url = `${EnvLoader.getOrThrow(
      'BASE_URL',
    )}/${mention_url}?redirect=true`;

    const useEmailDetail: UserTaggedDetail = {
      ...taggedData,
      type: EmailType.ASSIGN_USER_IN_WORK_ITEM,
      mention_url: url,
    };

    const userExists = await FirebaseFunctions.getInstance().getUserByEmail(
      email,
    );
    if (!userExists) throw new Error('Unauthorized Request!');

    await this.projectEmailService.sendProjectEmail(useEmailDetail);

    try {
      const contentSid = EnvLoader.getOrThrow('TWILIO_WA_TASK_ASSIGNED_SID');

      const targets = userDetail.filter((u) => !!u.phoneNumber);

      if (targets.length === 0) {
        logger?.warn(
          `No WhatsApp phone; skipped WA send for item ${item_name}`,
        );
      } else {
        const sends = targets.map((t) =>
          this.waService.sendTemplate({
            to: t.phoneNumber,
            contentSid,
            variables: {
              '1': t.name,
              '2': mentioner_name,
              '3': projectName,
              '4': item_name,
              '5': url,
            },
          }),
        );

        const results = await Promise.allSettled(sends);
        const ok = results.filter((r) => r.status === 'fulfilled').length;
        const fail = results.length - ok;
        logger?.info(
          `WhatsApp task assignment for item ${item_name}: sent=${ok}, failed=${fail}`,
        );

        results.forEach((r) => {
          if (r.status === 'rejected') {
            const e: any = r.reason;
            logger?.error(`WA error ${e?.code ?? ''}: ${e?.message ?? e}`);
          }
        });
      }
    } catch (waErr: any) {
      logger?.error(`WhatsApp send failed: ${waErr?.message ?? waErr}`);
    }

    return { success: true };
  }

  @Post('/finish_sign_up') async finishSignUp(
    @Body()
    user: {
      email: string;
      password: string;
      photoURL: string;
      name: string;
      phoneNumber: string;
    },
  ) {
    const { email, password, name, photoURL } = user;

    if (!email || !password || !name) {
      throw new Error('Invalid Email or Password');
    }

    const { user: userRecord } =
      await FirebaseFunctions.getInstance().createInvitedUser(user);
    return { user: userRecord };
  }

  @Post('/reminders') async name(@Body() params: RemindersType) {
    const { userEmail, userName, taskCount } = params;
    if (!userEmail || !userName || !taskCount) {
      throw new Error('Input Validation Field.');
    }
    logger?.info(`✅Processing Reminder email  to user: ${userEmail}`);
    const link =
      EnvLoader.getOrThrow('BASE_URL') + `/my_projects?redirect=true`;
    const sendEmailData: RemindersEmailProps = {
      ...params,
      dashboardLink: link,
      plural: taskCount > 1 ? 's' : '',
      type: EmailType.REMINDER,
    };
    await this.emailService.reminders(sendEmailData);
    return { success: true };
  }
}
