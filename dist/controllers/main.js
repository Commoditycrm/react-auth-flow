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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseUserController = void 0;
var routing_controllers_1 = require("routing-controllers");
var sendgrid_1 = require("../email/sendgrid");
var env_loader_1 = require("../env/env.loader");
var firebase_1 = require("../functions/firebase");
var FirebaseUserController = /** @class */ (function () {
    function FirebaseUserController() {
        this.emailService = sendgrid_1.EmailService.getInstance();
    }
    FirebaseUserController.prototype.createUser = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var email, password, verifyLink, emailDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = user.email, password = user.password;
                        return [4 /*yield*/, firebase_1.FirebaseFunctions.getInstance().createUser({
                                email: email === null || email === void 0 ? void 0 : email.trim(),
                                password: password,
                            })];
                    case 1:
                        verifyLink = _a.sent();
                        emailDetail = {
                            to: email,
                            type: sendgrid_1.EmailType.FIREBASE_VERIFY,
                            message: {
                                verifyLink: verifyLink,
                            },
                        };
                        return [4 /*yield*/, this.emailService.sendEmail(emailDetail)];
                    case 2:
                        _a.sent();
                        // logger.info(`Email sent for: ${email}`);
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    FirebaseUserController.prototype.resendVerificationLink = function (reqBody) {
        return __awaiter(this, void 0, void 0, function () {
            var email, verifyLink, emailDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = reqBody.email;
                        return [4 /*yield*/, firebase_1.FirebaseFunctions.getInstance().generateVerificationLink(email === null || email === void 0 ? void 0 : email.trim())];
                    case 1:
                        verifyLink = _a.sent();
                        emailDetail = {
                            to: email,
                            type: sendgrid_1.EmailType.FIREBASE_VERIFY,
                            message: {
                                verifyLink: verifyLink,
                            },
                        };
                        return [4 /*yield*/, this.emailService.sendEmail(emailDetail)];
                    case 2:
                        _a.sent();
                        // logger.info(`Email sent for: ${email}`);
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    FirebaseUserController.prototype.resetPassword = function (passwordRestBody) {
        return __awaiter(this, void 0, void 0, function () {
            var email, resetPasswordLink, emailDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = passwordRestBody.email;
                        return [4 /*yield*/, firebase_1.FirebaseFunctions.getInstance().resetPassword(email.trim())];
                    case 1:
                        resetPasswordLink = _a.sent();
                        emailDetail = {
                            to: email,
                            type: sendgrid_1.EmailType.PASSWORD_RESET,
                            message: {
                                resetPasswordLink: resetPasswordLink,
                            },
                        };
                        return [4 /*yield*/, this.emailService.sendEmail(emailDetail)];
                    case 2:
                        _a.sent();
                        // logger.info(`Email sent for: ${email}`);
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
    FirebaseUserController.prototype.inviteUser = function (inviteUser) {
        return __awaiter(this, void 0, void 0, function () {
            var email, companyId, invitationLink, emailDetail;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = inviteUser.email, companyId = inviteUser.companyId;
                        invitationLink = "".concat(env_loader_1.EnvLoader.getOrThrow('BASE_URL'), "/invite?companyId=").concat(companyId);
                        emailDetail = {
                            to: email,
                            type: sendgrid_1.EmailType.INVITE_USER,
                            message: {
                                invitationLink: invitationLink,
                            },
                        };
                        return [4 /*yield*/, this.emailService.sendEmail(emailDetail)];
                    case 1:
                        _a.sent();
                        // logger.info(`Email sent for: ${email}`);
                        return [2 /*return*/, { success: true }];
                }
            });
        });
    };
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
    FirebaseUserController = __decorate([
        (0, routing_controllers_1.JsonController)('/users'),
        __metadata("design:paramtypes", [])
    ], FirebaseUserController);
    return FirebaseUserController;
}());
exports.FirebaseUserController = FirebaseUserController;
