"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const sendgrid_1 = require("../email/sendgrid");
const env_loader_1 = require("../env/env.loader");
const firebase_1 = require("../functions/firebase");
let FirebaseUserController = class FirebaseUserController {
    constructor() {
        this.emailService = sendgrid_1.EmailService.getInstance();
    }
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = user;
            // logger.info(`Processing request for : ${email} with locale: ${locale}`);
            const verifyLink = yield firebase_1.FirebaseFunctions.getInstance().createUser({
                email: email === null || email === void 0 ? void 0 : email.trim(),
                password,
            });
            const emailDetail = {
                to: email,
                type: sendgrid_1.EmailType.FIREBASE_VERIFY,
                message: {
                    verifyLink,
                },
            };
            yield this.emailService.sendEmail(emailDetail);
            // logger.info(`Email sent for: ${email}`);
            return { success: true };
        });
    }
    resendVerificationLink(reqBody) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = reqBody;
            if (!email) {
                throw new Error('Input Validation Error');
            }
            // logger.info(`Processing request for : ${email} with locale: ${locale}`);
            const verifyLink = yield firebase_1.FirebaseFunctions.getInstance().generateVerificationLink(email === null || email === void 0 ? void 0 : email.trim());
            const emailDetail = {
                to: email,
                type: sendgrid_1.EmailType.FIREBASE_VERIFY,
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
                type: sendgrid_1.EmailType.PASSWORD_RESET,
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
            if (!userExists)
                throw new Error('Unauthorized Request!');
            // logger.info(`Processing request for : ${email} with locale: ${locale}`);
            const invitationLink = `${env_loader_1.EnvLoader.getOrThrow('BASE_URL')}/invite?companyId=${companyId}&inviteeEmail=${inviteeEmail}`;
            const emailDetail = {
                to: inviteeEmail,
                type: sendgrid_1.EmailType.INVITE_USER,
                message: {
                    invitationLink,
                },
            };
            yield this.emailService.sendEmail(emailDetail);
            // logger.info(`Email sent for: ${email}`);
            return { success: true };
        });
    }
};
exports.FirebaseUserController = FirebaseUserController;
__decorate([
    (0, routing_controllers_1.Post)('/'),
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
exports.FirebaseUserController = FirebaseUserController = __decorate([
    (0, routing_controllers_1.JsonController)('/users'),
    __metadata("design:paramtypes", [])
], FirebaseUserController);
