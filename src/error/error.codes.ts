type FirebaseErrorType = Record<
  string,
  {
    statusCode: number;
    errorCode: string;
  }
>;

export const FIREBASE_ERROR_CODES: FirebaseErrorType = {
  'auth/email-already-exists': {
    statusCode: 403,
    errorCode: 'AUTH_EMAIL_EXISTS',
  },
  'auth/invalid-password': {
    statusCode: 400,
    errorCode: 'AUTH_INVALID_PASSWORD',
  },
  'auth/unsupported-country': {
    statusCode: 403,
    errorCode: 'AUTH_UNSUPPORTED_COUNTRY',
  },
  'auth/invalid-email': { statusCode: 400, errorCode: 'AUTH_INVALID_EMAIL' },
  'auth/email-not-found': { statusCode: 403, errorCode: 'AUTH_USER_NOT_FOUND' },

  /** TO BE USED IF REQUEST IS PERMITTED FROM APP ONLY
   * 'auth/missing-android-pkg-name': {
    statusCode: 403,
    errorCode: 'AUTH_ANDROID_APP_MISSING',
  },
  'auth/missing-ios-bundle-id': {
    statusCode: 403,
    errorCode: 'AUTH_IOS_APP_MISSING',
  },
  * */
};

export const ERROR_MESSAGES: Record<string, string> = {
  AUTH_UNSUPPORTED_COUNTRY:
    'You cannot register from this country. Unfortunately, EventMe is still not available in your country',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
  AUTH_EMAIL_EXISTS:
    'This email already exists. This email has already been used for creating an account, try another one',
  AUTH_INVALID_EMAIL:
    'This email is incorrect. The format of the email is not valid, please try to retype it',
  AUTH_INVALID_PASSWORD:
    'This password is incorrect. Please try to retype the password again',
  AUTH_USER_NOT_FOUND:
    "Password unavailable. You still don't have an account on EventMe. Please register first in order to login.",
};
