"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseUserController = void 0;
const routing_controllers_1 = require("routing-controllers");
const sendgrid = __importStar(require("../email/sendgrid"));
const env_loader_1 = require("../env/env.loader");
const firebase_1 = require("../functions/firebase");
let FirebaseUserController = class FirebaseUserController {
    constructor() {
        this.emailService = sendgrid.EmailService.getInstance();
        this.projectEmailService = sendgrid.ProjectEmailService.getInstance();
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name } = user;
            // logger.info(`Processing request for : ${email} with locale: ${locale}`);
            const verifyLink = yield firebase_1.FirebaseFunctions.getInstance().createUser({
                email: email === null || email === void 0 ? void 0 : email.trim(),
                password,
                name
            });
            const expirationTime = new Date(Date.now() + 3600 * 1000).toISOString();
            const emailDetail = {
                to: email,
                type: sendgrid.EmailType.FIREBASE_VERIFY,
                message: {
                    verifyLink,
                },
            };
            yield this.emailService.sendEmail(emailDetail);
            // logger.info(`Email sent for: ${email}`);
            return { success: true, link: verifyLink, expiresAt: expirationTime };
        });
    }
    resendVerificationLink(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, link } = reqBody;
            if (!email) {
                throw new Error('Input Validation Error');
            }
            // logger.info(`Processing request for : ${email} with locale: ${locale}`);
            const verifyLink = link ||
                (yield firebase_1.FirebaseFunctions.getInstance().generateVerificationLink(email === null || email === void 0 ? void 0 : email.trim()));
            const emailDetail = {
                to: email,
                type: sendgrid.EmailType.FIREBASE_VERIFY,
                message: {
                    verifyLink,
                },
            };
            yield this.emailService.sendEmail(emailDetail);
            // logger.info(`Email sent for: ${email}`);
            return { success: true };
        });
    }
    resetPassword(passwordRestBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = passwordRestBody;
            const url = `${env_loader_1.EnvLoader.getOrThrow('BASE_URL')}/reset_password`;
            const actionCodeSettings = {
                url,
                handleCodeInApp: true,
            };
            if (!email) {
                throw new Error('Input Validation Error');
            }
            // logger.info(`Processing request for : ${email} with locale: ${locale}`);
            const resetPasswordLink = yield firebase_1.FirebaseFunctions.getInstance().resetPassword(email.trim(), actionCodeSettings);
            const emailDetail = {
                to: email,
                type: sendgrid.EmailType.PASSWORD_RESET,
                message: {
                    resetPasswordLink,
                },
            };
            yield this.emailService.sendEmail(emailDetail);
            // logger.info(`Email sent for: ${email}`);
            return { success: true };
        });
    }
    inviteUser(inviteUser) {
        return __awaiter(this, void 0, void 0, function* () {
            const { inviteeEmail, email, companyId } = inviteUser;
            if (!inviteeEmail || !email || !companyId) {
                throw new Error('Input Validation Error');
            }
            const userExists = yield firebase_1.FirebaseFunctions.getInstance().getUserByEmail(email);
            let invitedUserExists = null;
            try {
                invitedUserExists = yield firebase_1.FirebaseFunctions.getInstance().getUserByEmail(inviteeEmail);
            }
            catch (error) {
                if (error.code !== 'auth/user-not-found') {
                    throw error; // rethrow if it's a different error
                }
            }
            if (!userExists)
                throw new Error('Unauthorized Request!');
            // logger.info(`Processing request for : ${email} with locale: ${locale}`);
            if (invitedUserExists) {
                throw new Error('User already exists');
            }
            const invitationLink = `${env_loader_1.EnvLoader.getOrThrow('BASE_URL')}/invite?companyId=${companyId}&inviteeEmail=${inviteeEmail}`;
            const emailDetail = {
                to: inviteeEmail,
                type: sendgrid.EmailType.INVITE_USER,
                message: {
                    invitationLink,
                },
            };
            yield this.emailService.sendEmail(emailDetail);
            // logger.info(`Email sent for: ${email}`);
            return { success: true };
        });
    }
    tagUser(taggedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mention_url, item_name, mentioner_name, email, userDetail, message, item_type, } = taggedData;
            if (!mention_url ||
                !item_name ||
                !mentioner_name ||
                !email ||
                !userDetail ||
                !message ||
                !item_type) {
                throw new Error('Input Validation Error');
            }
            const url = `${env_loader_1.EnvLoader.getOrThrow('BASE_URL')}/${mention_url}`;
            const useEmailDetail = Object.assign(Object.assign({}, taggedData), { type: sendgrid.EmailType.TAGGING_USER, mention_url: url });
            const userExists = yield firebase_1.FirebaseFunctions.getInstance().getUserByEmail(email);
            if (!userExists)
                throw new Error('Unauthorized Request!');
            yield this.projectEmailService.sendProjectEmail(useEmailDetail);
            return { success: true };
        });
    }
    assignUser(taggedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { mention_url, item_name, mentioner_name, email, userDetail, item_type, item_uid, } = taggedData;
            if (!mention_url ||
                !item_name ||
                !mentioner_name ||
                !email ||
                !userDetail ||
                !item_type) {
                throw new Error('Input Validation Error');
            }
            const url = `${env_loader_1.EnvLoader.getOrThrow('BASE_URL')}/${mention_url}`;
            const useEmailDetail = Object.assign(Object.assign({}, taggedData), { type: sendgrid.EmailType.ASSIGN_USER_IN_WORK_ITEM, mention_url: url });
            const userExists = yield firebase_1.FirebaseFunctions.getInstance().getUserByEmail(email);
            if (!userExists)
                throw new Error('Unauthorized Request!');
            yield this.projectEmailService.sendProjectEmail(useEmailDetail);
            return { success: true };
        });
    }
    finishSignUp(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password, name, photoURL } = user;
            if (!email || !password || !name) {
                throw new Error('Invalid Email or Password');
            }
            const { token } = yield firebase_1.FirebaseFunctions.getInstance().createInvitedUser(user);
            return { token };
        });
    }
};
exports.FirebaseUserController = FirebaseUserController;
__decorate([
    (0, routing_controllers_1.Post)('/users'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseUserController.prototype, "createUser", null);
__decorate([
    (0, routing_controllers_1.Post)('/resend-verification'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseUserController.prototype, "resendVerificationLink", null);
__decorate([
    (0, routing_controllers_1.Post)('/password-reset'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseUserController.prototype, "resetPassword", null);
__decorate([
    (0, routing_controllers_1.Post)('/invite-user'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseUserController.prototype, "inviteUser", null);
__decorate([
    (0, routing_controllers_1.Post)('/tag_user'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseUserController.prototype, "tagUser", null);
__decorate([
    (0, routing_controllers_1.Post)('/assign'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseUserController.prototype, "assignUser", null);
__decorate([
    (0, routing_controllers_1.Post)('/finish_sign_up'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], FirebaseUserController.prototype, "finishSignUp", null);
exports.FirebaseUserController = FirebaseUserController = __decorate([
    (0, routing_controllers_1.JsonController)('/'),
    __metadata("design:paramtypes", [])
], FirebaseUserController);
