import { UserRecord } from 'firebase-admin/auth';
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

  async createUser(userInput: { email: string; password: string }) {
    const user = await this.admin.app.auth().createUser({
      email: userInput?.email,
      password: userInput?.password,
    });

    await this.setUserClaims(user.uid, user.email);

    const verifyLink = await this.generateVerificationLink(userInput.email);

    // logger.debug(`verifyLink: ${verifyLink}`);

    return verifyLink;
  }

  async generateVerificationLink(email: string) {
    return await this.admin.app.auth().generateEmailVerificationLink(email);
  }

  async resetPassword(email: string) {
    const passwordResetLink = await this.admin.app
      .auth()
      .generatePasswordResetLink(email);

    // logger.debug(`Password-Reset Link: ${passwordResetLink}`);

    return passwordResetLink;
  }

  async setUserClaims(
    userId: string | undefined,
    email: string | undefined,
  ): Promise<string[]> {
    if (!userId || !email) throw new Error('Invalid userId or Email');

    const roles = this.getRoleByEmail(email);

    await this.admin.app.auth().setCustomUserClaims(userId, { roles });
    return roles;
  }

  async getUserByEmail(email: string): Promise<UserRecord> {
    if (!email) throw new Error('Invalid userId or Email');

    const user = await this.admin.app.auth().getUserByEmail(email);

    return user;
  }
}
