export enum EmailType {
  FIREBASE_VERIFY = 'FIREBASE_VERIFY',
  PASSWORD_RESET = 'PASSWORD_RESET',
  INVITE_USER = 'INVITE_USER',
  TAGGING_USER = 'TAGGING_USER',
  ASSIGN_USER_IN_WORK_ITEM = 'ASSIGN_USER_IN_WORK_ITEM',
}

export interface EmailDetail {
  to: string;
  type: EmailType;
  message: Record<string, string>;
}

export interface UserTaggedDetail extends EmailDetail {
  userDetail: Array<{ email: string; name: string }>;
  user_name: string;
  mentioner_name: string;
  item_name: string;
  mention_url: string;
  email: string;
  item_type: string;
  item_uid: number;
}
