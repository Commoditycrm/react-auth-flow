import { UserRecord } from 'firebase-admin/auth';
import { FirebaseAdmin } from './admin';
import { ActionCodeSettings, User } from 'firebase/auth';
import { EnvLoader } from '../env/env.loader';

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

  async createUser(userInput: {
    email: string;
    password: string;
    name: string;
  }) {
    const user = await this.admin.app.auth().createUser({
      email: userInput?.email,
      password: userInput?.password,
      displayName: userInput?.name,
    });

    await this.setUserClaims(user.uid, user.email);

    const verifyLink = await this.generateVerificationLink(userInput.email);

    // logger.debug(`verifyLink: ${verifyLink}`);

    return verifyLink;
  }

  async generateVerificationLink(email: string) {
    const url = `${EnvLoader.getOrThrow('BASE_URL')}/login`;
    const actionCodeSettings: ActionCodeSettings = {
      url,
      handleCodeInApp: true,
    };
    return await this.admin.app
      .auth()
      .generateEmailVerificationLink(email, actionCodeSettings);
  }

  async resetPassword(email: string, actionCodeSettings: ActionCodeSettings) {
    const passwordResetLink = await this.admin.app
      .auth()
      .generatePasswordResetLink(email, actionCodeSettings);

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

  async createInvitedUser(userInput: {
    email: string;
    password: string;
    name: string;
  }): Promise<{ token: string }> {
    const user = await this.admin.app.auth().createUser({
      email: userInput?.email,
      password: userInput?.password,
      displayName: userInput?.name,
      emailVerified: true,
    });
    await this.setUserClaims(user.uid, user.email);
    const token = await this.admin.app.auth().createCustomToken(user.uid);
    return { token };
  }
}
