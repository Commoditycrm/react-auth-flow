"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseFunctions = void 0;
const admin_1 = require("./admin");
const env_loader_1 = require("../env/env.loader");
const logger_1 = __importDefault(require("../logger"));
class FirebaseFunctions {
    constructor() {
        this.admin = admin_1.FirebaseAdmin.getInstance();
        this.admin = admin_1.FirebaseAdmin.getInstance();
    }
    isCompanyEmail(email) {
        if (!email)
            return false;
        return email.endsWith('@agilenautics.com');
    }
    getRoleByEmail(email) {
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
    createUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.admin.app.auth().createUser({
                email: userInput === null || userInput === void 0 ? void 0 : userInput.email,
                password: userInput === null || userInput === void 0 ? void 0 : userInput.password,
                displayName: userInput === null || userInput === void 0 ? void 0 : userInput.name,
            });
            yield this.setUserClaims(user.uid, user.email);
            const verifyLink = yield this.generateVerificationLink(userInput.email);
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.debug(`verifyLink: ${verifyLink}`);
            return verifyLink;
        });
    }
    generateVerificationLink(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${env_loader_1.EnvLoader.getOrThrow('BASE_URL')}/login`;
            const actionCodeSettings = {
                url,
                handleCodeInApp: true,
            };
            return yield this.admin.app
                .auth()
                .generateEmailVerificationLink(email, actionCodeSettings);
        });
    }
    resetPassword(email, actionCodeSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordResetLink = yield this.admin.app
                .auth()
                .generatePasswordResetLink(email, actionCodeSettings);
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.debug(`Password-Reset Link: ${passwordResetLink}`);
            return passwordResetLink;
        });
    }
    setUserClaims(userId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId || !email)
                throw new Error('Invalid userId or Email');
            const roles = this.getRoleByEmail(email);
            yield this.admin.app.auth().setCustomUserClaims(userId, { roles });
            return roles;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email)
                throw new Error('Invalid userId or Email');
            const user = yield this.admin.app.auth().getUserByEmail(email);
            return user;
        });
    }
    createInvitedUser(userInput) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.admin.app.auth().createUser({
                email: userInput === null || userInput === void 0 ? void 0 : userInput.email,
                password: userInput === null || userInput === void 0 ? void 0 : userInput.password,
                displayName: userInput === null || userInput === void 0 ? void 0 : userInput.name,
                emailVerified: true,
                phoneNumber: userInput.phoneNumber,
            });
            yield this.setUserClaims(user.uid, user.email);
            // const token = await this.admin.app.auth().createCustomToken(user.uid);
            return { user };
        });
    }
}
exports.FirebaseFunctions = FirebaseFunctions;
