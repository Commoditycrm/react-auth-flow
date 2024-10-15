import { Body, JsonController, Post } from 'routing-controllers';
import { EmailDetail, EmailService, EmailType } from '../email/sendgrid';
import { EnvLoader } from '../env/env.loader';
import { FirebaseFunctions } from '../functions/firebase';

@JsonController('/users')
export class FirebaseUserController {
  emailService: EmailService;

  constructor() {
    this.emailService = EmailService.getInstance();
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

    const emailDetail: EmailDetail = {
      to: email,
      type: EmailType.FIREBASE_VERIFY,
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

    const emailDetail: EmailDetail = {
      to: email,
      type: EmailType.FIREBASE_VERIFY,
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

    if (!email) {
      throw new Error('Input Validation Error');
    }
    // logger.info(`Processing request for : ${email} with locale: ${locale}`);

    const resetPasswordLink =
      await FirebaseFunctions.getInstance().resetPassword(email.trim());

    const emailDetail: EmailDetail = {
      to: email,
      type: EmailType.PASSWORD_RESET,
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

    const emailDetail: EmailDetail = {
      to: inviteeEmail,
      type: EmailType.INVITE_USER,
      message: {
        invitationLink,
      },
    };

    await this.emailService.sendEmail(emailDetail);

    // logger.info(`Email sent for: ${email}`);

    return { success: true };
  }
}
