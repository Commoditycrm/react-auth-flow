"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailType = exports.FirebaseConfig = void 0;
var FirebaseConfig;
(function (FirebaseConfig) {
    FirebaseConfig["FIREBASE_API_KEY"] = "FIREBASE_API_KEY";
    FirebaseConfig["FIREBASE_PRIVATE_KEY"] = "FIREBASE_PRIVATE_KEY";
    FirebaseConfig["FIREBASE_AUTH_DOMAIN"] = "FIREBASE_AUTH_DOMAIN";
    FirebaseConfig["FIREBASE_PROJECT_ID"] = "FIREBASE_PROJECT_ID";
    FirebaseConfig["FIREBASE_MESSAGE_SENDER_ID"] = "FIREBASE_MESSAGE_SENDER_ID";
    FirebaseConfig["FIREBASE_APP_ID"] = "FIREBASE_APP_ID";
    FirebaseConfig["FIREBASE_MEASUREMENT_ID"] = "FIREBASE_MEASUREMENT_ID";
    FirebaseConfig["FIREBASE_CLIENT_EMAIL"] = "FIREBASE_CLIENT_EMAIL";
    FirebaseConfig["FIREBASE_DYNAMIC_LINK_DOMAIN"] = "FIREBASE_DYNAMIC_LINK_DOMAIN";
    FirebaseConfig["FIREBASE_STORAGE_BUCKET"] = "FIREBASE_STORAGE_BUCKET";
    FirebaseConfig["FIRBASE_STORAGE_PATH"] = "FIRBASE_STORAGE_PATH";
})(FirebaseConfig || (exports.FirebaseConfig = FirebaseConfig = {}));
var EmailType;
(function (EmailType) {
    EmailType["FIREBASE_VERIFY"] = "FIREBASE_VERIFY";
    EmailType["PASSWORD_RESET"] = "PASSWORD_RESET";
    EmailType["INVITE_USER"] = "INVITE_USER";
    EmailType["TAGGING_USER"] = "TAGGING_USER";
    EmailType["ASSIGN_USER_IN_WORK_ITEM"] = "ASSIGN_USER_IN_WORK_ITEM";
    EmailType["REMOVE_USER_FROM_PROJECT"] = "REMOVE_USER_FROM_PROJECT";
    EmailType["DEACTIVATE_ORG"] = "DEACTIVATE_ORG";
    EmailType["DELETE_ORG"] = "DELETE_ORG";
    EmailType["ACTIVATE_ORG"] = "ACTIVATE_ORG";
})(EmailType || (exports.EmailType = EmailType = {}));
