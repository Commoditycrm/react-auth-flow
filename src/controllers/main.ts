import { Body, HttpError, JsonController, Post } from 'routing-controllers';
import * as sendgrid from '../email/sendgrid';
import { EnvLoader } from '../env/env.loader';
import { FirebaseFunctions } from '../functions/firebase';
import { ActionCodeSettings } from 'firebase/auth';

@JsonController('/users')
export class FirebaseUserController {
  emailService: sendgrid.EmailService;
  projectEmailService: sendgrid.ProjectEmailService;

  constructor() {
    this.emailService = sendgrid.EmailService.getInstance();
    this.projectEmailService = sendgrid.ProjectEmailService.getInstance();
  }

  @Post('/')
  async createUser(
    @Body()
    user: {
      email: string;
      password: string;
      photoURL: string;
    },
  ) {
    const { email, password } = user;

    // logger.info(`Processing request for : ${email} with locale: ${locale}`);

    const verifyLink = await FirebaseFunctions.getInstance().createUser({
      email: email?.trim(),
      password,
    });

    const emailDetail: sendgrid.EmailDetail = {
      to: email,
      type: sendgrid.EmailType.FIREBASE_VERIFY,
      message: {
        verifyLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    // logger.info(`Email sent for: ${email}`);
    return { success: true };
  }

  @Post('/resend-verification')
  async resendVerificationLink(
    @Body()
    reqBody: {
      email: string;
    },
  ) {
    const { email } = reqBody;
    if (!email) {
      throw new Error('Input Validation Error');
    }

    // logger.info(`Processing request for : ${email} with locale: ${locale}`);

    const verifyLink =
      await FirebaseFunctions.getInstance().generateVerificationLink(
        email?.trim(),
      );

    const emailDetail: sendgrid.EmailDetail = {
      to: email,
      type: sendgrid.EmailType.FIREBASE_VERIFY,
      message: {
        verifyLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    // logger.info(`Email sent for: ${email}`);
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

    const emailDetail: sendgrid.EmailDetail = {
      to: email,
      type: sendgrid.EmailType.PASSWORD_RESET,
      message: {
        resetPasswordLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    // logger.info(`Email sent for: ${email}`);

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

    if (!userExists) throw new Error('Unauthorized Request!');
    // logger.info(`Processing request for : ${email} with locale: ${locale}`);

    const invitationLink = `${EnvLoader.getOrThrow(
      'BASE_URL',
    )}/invite?companyId=${companyId}&inviteeEmail=${inviteeEmail}`;

    const emailDetail: sendgrid.EmailDetail = {
      to: inviteeEmail,
      type: sendgrid.EmailType.INVITE_USER,
      message: {
        invitationLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    // logger.info(`Email sent for: ${email}`);

    return { success: true };
  }

  @Post('/tag_user')
  async tagUser(
    @Body()
    taggedData: sendgrid.UserTaggedDetail,
  ) {
    console.log(taggedData);
    const { user_name, mention_url, item_name, mentioner_name, to, email } =
      taggedData;
    if (
      !mention_url ||
      !user_name ||
      !item_name ||
      !mentioner_name ||
      !to ||
      !email
    ) {
      throw new Error('Input Validation Error');
    }
    const url = `${EnvLoader.getOrThrow('BASE_URL')}/${mention_url}`;

    const userDetail: sendgrid.UserTaggedDetail = {
      ...taggedData,
      type: sendgrid.EmailType.TAGGING_USER,
      mention_url: url,
    };
    const userExists = await FirebaseFunctions.getInstance().getUserByEmail(
      email,
    );
    if (!userExists) throw new Error('Unauthorized Request!');

    await this.projectEmailService.sendProjectEmail(userDetail);
    return { success: true };
  }
}
