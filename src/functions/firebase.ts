import { FirebaseAdmin } from './admin';

export class FirebaseFunctions {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  admin: FirebaseAdmin = FirebaseAdmin.getInstance();

  static instance: FirebaseFunctions;

  private constructor() {
    this.admin = FirebaseAdmin.getInstance();
  }

  private isCompanyEmail(email: string) {
    if (!email) return false;
    return email.endsWith('@agilenaustics.com');
  }

  private getRoleByEmail(email: string): string[] {
    if (this.isCompanyEmail(email)) {
      return ['SYSTEM_ADMIN'];
    }
    return ['USER'];
  }

  static getInstance() {
    if (!FirebaseFunctions.instance) {
      FirebaseFunctions.instance = new FirebaseFunctions();
    }
    return FirebaseFunctions.instance;
  }

  createUser = async (userInput: { email: string; password: string }) => {
    const user = await this.admin.app.auth().createUser({
      email: userInput?.email,
      password: userInput?.password,
    });

    await this.setUserClaims(user.uid, user.email);

    const verifyLink = await this.admin.app
      .auth()
      .generateEmailVerificationLink(userInput.email);

    // logger.debug(`verifyLink: ${verifyLink}`);

    return verifyLink;
  };

  resetPassword = async (email: string) => {
    const passwordResetLink = await this.admin.app
      .auth()
      .generatePasswordResetLink(email);

    // logger.debug(`Password-Reset Link: ${passwordResetLink}`);

    return passwordResetLink;
  };

  setUserClaims = async (
    userId: string | undefined,
    email: string | undefined,
  ): Promise<string[]> => {
    if (!userId || !email) throw new Error('Invalid userId or Email');

    const roles = this.getRoleByEmail(email);

    await this.admin.app.auth().setCustomUserClaims(userId, { roles });
    return roles;
  };
}
