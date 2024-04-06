import { Body, JsonController, Post } from 'routing-controllers';
import { EmailDetail, EmailService, EmailType } from './email/sendgrid';
import { FirebaseFunctions } from './functions/firebase';

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

  @Post('/password-reset')
  async resetPassword(@Body() passwordRestBody: { email: string }) {
    const { email } = passwordRestBody;

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
}
