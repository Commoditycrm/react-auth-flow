export enum FirebaseConfig {
  FIREBASE_API_KEY = 'FIREBASE_API_KEY',
  FIREBASE_PRIVATE_KEY = 'FIREBASE_PRIVATE_KEY',
  FIREBASE_AUTH_DOMAIN = 'FIREBASE_AUTH_DOMAIN',
  FIREBASE_PROJECT_ID = 'FIREBASE_PROJECT_ID',
  FIREBASE_MESSAGE_SENDER_ID = 'FIREBASE_MESSAGE_SENDER_ID',
  FIREBASE_APP_ID = 'FIREBASE_APP_ID',
  FIREBASE_MEASUREMENT_ID = 'FIREBASE_MEASUREMENT_ID',
  FIREBASE_CLIENT_EMAIL = 'FIREBASE_CLIENT_EMAIL',
  FIREBASE_DYNAMIC_LINK_DOMAIN = 'FIREBASE_DYNAMIC_LINK_DOMAIN',
}

export interface FirebaseUser {
  readonly uid: string;
  readonly name?: string;
  readonly email?: string;
  readonly emailVerified: boolean;
  readonly phone?: string;
  readonly photo?: string;
  readonly signInProvider: string;
  readonly claims?: {
    [key: string]: unknown;
  };
}

export enum EmailType {
  FIREBASE_VERIFY = 'FIREBASE_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
  INVITE_USER = 'INVITE_USER',
  TAGGING_USER = 'TAGGING_USER',
  ASSIGN_USER_IN_WORK_ITEM = 'ASSIGN_USER_IN_WORK_ITEM',
  REMOVE_USER_FROM_PROJECT = 'REMOVE_USER_FROM_PROJECT',
  DEACTIVATE_ORG = 'DEACTIVATE_ORG',
  DELETE_ORG = 'DELETE_ORG',
  ACTIVATE_ORG = 'ACTIVATE_ORG',
  REMINDER = 'REMINDER',
  CREATE_EVENT = 'CREATE_EVENT',
}

export interface EmailDetail {
  to: string;
  type: EmailType;
  message: Record<string, string>;
}

export interface UserTaggedDetail extends EmailDetail {
  userDetail: Array<{ email: string; name: string; phoneNumber: string }>;
  user_name: string;
  mentioner_name: string;
  item_name: string;
  mention_url: string;
  email: string;
  item_type: string;
  item_uid: number;
  projectName: string;
}

export type RemoveUserBodyType = {
  userName: string;
  orgName: string;
  projectName: string;
  userEmail: string;
};

export interface RemoveUserProps extends RemoveUserBodyType {
  type: string;
}

export type OrgDeactivateProps = Omit<RemoveUserBodyType, 'projectName'> & {};
export type DeleteOrgType = Omit<RemoveUserBodyType, 'projectName'> & {};

export type DeactivateOrgType = Omit<RemoveUserProps, 'projectName'> & {
  supportEmail: string | undefined;
};
export type DeleteOrgSendEmailProps = Omit<DeactivateOrgType, 'projectName'> & {
  supportEmail: string | undefined;
};

export type ActivationOrgType = Omit<
  DeactivateOrgType,
  'supportEmail' | 'type'
> & {};

export type ActivationOrgEmailProps = Omit<
  ActivationOrgType,
  'projectName' | 'supportEmail'
> & {
  dashboardLink: string;
  type: string;
};
export type RemindersType = Omit<ActivationOrgType, 'orgName' | ''> & {
  taskCount: number;
};
export type RemindersEmailProps = Omit<ActivationOrgEmailProps, 'orgName'> & {
  taskCount: number;
  plural: string;
};

// interfaces/whatsapp.ts
export enum WhatsAppTemplate {
  REMOVE_USER_FROM_PROJECT = 'REMOVE_USER_FROM_PROJECT',
}

export type RemoveUserWhatsAppProps = RemoveUserBodyType & {
  type: WhatsAppTemplate.REMOVE_USER_FROM_PROJECT;
};

export type WhatsAppTextPayload = {
  to: string; // Recipient phone number, e.g. "+91XXXXXXXXXX"
  body: string; // Text message
};

export type WhatsAppMediaPayload = WhatsAppTextPayload & {
  mediaUrl?: string[]; // optional list of media URLs (image, pdf, etc.)
};

export type CreateEventBodyType = Omit<RemoveUserBodyType, 'userEmail'> & {
  title: string;
  description: string;
  startLocal: string;
  endLocal: string;
  resourceName: string;
  duration: string;
  orgOwnerEmail: string;
  projectOwnerEmail: string;
  path:string;
  createdAt:string;
};

export interface CreateEventProps extends CreateEventBodyType {
  type: string;
  url:string;
}
