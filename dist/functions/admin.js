"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseAdmin = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const env_loader_1 = require("../env/env.loader");
const logger_1 = __importDefault(require("../logger"));
const interfaces_1 = require("../interfaces");
class FirebaseAdmin {
    constructor() {
        this.serviceAccount = {
            privateKey: env_loader_1.EnvLoader.getOrThrow(interfaces_1.FirebaseConfig.FIREBASE_PRIVATE_KEY),
            projectId: env_loader_1.EnvLoader.getOrThrow(interfaces_1.FirebaseConfig.FIREBASE_PROJECT_ID),
            clientEmail: env_loader_1.EnvLoader.getOrThrow(interfaces_1.FirebaseConfig.FIREBASE_CLIENT_EMAIL),
            storageBucket: env_loader_1.EnvLoader.getOrThrow(interfaces_1.FirebaseConfig.FIREBASE_STORAGE_BUCKET),
        };
        this.adminInitFirebase = () => {
            try {
                if (!firebase_admin_1.default.apps.length) {
                    this.app = firebase_admin_1.default.initializeApp({
                        credential: firebase_admin_1.default.credential.cert(this.serviceAccount),
                        storageBucket: this.serviceAccount.storageBucket,
                    });
                }
                this.app = firebase_admin_1.default.apps[0];
            }
            catch (err) {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`Failed to init admin firebase: ${err}`);
                throw err;
            }
        };
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
exports.FirebaseAdmin = FirebaseAdmin;
