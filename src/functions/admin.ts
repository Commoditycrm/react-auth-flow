import admin, { app } from 'firebase-admin';
import { ActionCodeSettings } from 'firebase/auth';
import { EnvLoader } from '../env/env.loader';
import logger from '../logger';
import { FirebaseConfig } from '../interfaces';

export class FirebaseAdmin {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  app!: app.App;

  serviceAccount = {
    privateKey: EnvLoader.getOrThrow(FirebaseConfig.FIREBASE_PRIVATE_KEY),
    projectId: EnvLoader.getOrThrow(FirebaseConfig.FIREBASE_PROJECT_ID),
    clientEmail: EnvLoader.getOrThrow(FirebaseConfig.FIREBASE_CLIENT_EMAIL),
  };

  actionCodeSettings: ActionCodeSettings | undefined;

  static instance: FirebaseAdmin;

  adminInitFirebase = () => {
    try {
      if (!admin.apps.length) {
        this.app = admin.initializeApp({
          credential: admin.credential.cert(this.serviceAccount),
        });
      }
      this.app = admin.apps[0] as app.App;
    } catch (err) {
      logger?.error(`Failed to init admin firebase: ${err}`);
      throw err;
    }
  };

  private constructor() {
    this.adminInitFirebase();

    if (!this.app) {
      throw new Error(`Firebase failed to initialise the adming app`);
    }
  }

  static getInstance() {
    if (!FirebaseAdmin.instance) {
      FirebaseAdmin.instance = new FirebaseAdmin();
    }
    return FirebaseAdmin.instance;
  }
}
