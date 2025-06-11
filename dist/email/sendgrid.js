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
exports.ProjectEmailService = exports.EmailService = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const env_loader_1 = require("../env/env.loader");
const logger_1 = __importDefault(require("../logger"));
class EmailService {
    constructor() {
        this.apiKey = env_loader_1.EnvLoader.getOrThrow('SENDGRID_KEY');
        this.from = env_loader_1.EnvLoader.getOrThrow('EMAIL_FROM');
    }
    sendEmail(emailDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendgridMessage = {
                from: EmailService.instance.from,
                templateId: env_loader_1.EnvLoader.getOrThrow(`${emailDetail.type}_TEMPLATE_ID`),
                personalizations: [
                    {
                        to: emailDetail.to,
                        dynamicTemplateData: emailDetail.message,
                    },
                ],
            };
            try {
                yield mail_1.default.send(sendgridMessage);
                // TODO: Retry mechanism
                return true;
            }
            catch (e) {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`Error While sending email ${e}`);
            }
            return false;
        });
    }
    static getInstance() {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
            mail_1.default.setApiKey(EmailService.instance.apiKey);
        }
        return EmailService.instance;
    }
}
exports.EmailService = EmailService;
class ProjectEmailService {
    constructor() {
        this.apiKey = env_loader_1.EnvLoader.getOrThrow('SENDGRID_KEY');
        this.from = env_loader_1.EnvLoader.getOrThrow('EMAIL_FROM');
    }
    sendProjectEmail(taggedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const sendgridMessage = {
                from: ProjectEmailService === null || ProjectEmailService === void 0 ? void 0 : ProjectEmailService.instance.from,
                templateId: env_loader_1.EnvLoader.getOrThrow(`${taggedData === null || taggedData === void 0 ? void 0 : taggedData.type}_TEMPLATE_ID`),
                personalizations: taggedData.userDetail.map((user) => ({
                    to: user.email,
                    dynamicTemplateData: {
                        user_name: user.name,
                        item_name: taggedData.item_name,
                        mentioner_name: taggedData.mentioner_name,
                        mention_url: taggedData.mention_url,
                        message: taggedData.message,
                        item_type: taggedData.item_type,
                        item_uid: taggedData.item_uid,
                    },
                })),
            };
            try {
                yield mail_1.default.send(sendgridMessage);
                return true;
            }
            catch (error) {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`Error While sending email ${error}`);
            }
            return false;
        });
    }
    removeUserFromProject() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    static getInstance() {
        if (!ProjectEmailService.instance) {
            ProjectEmailService.instance = new ProjectEmailService();
            mail_1.default.setApiKey(ProjectEmailService.instance.apiKey);
        }
        return ProjectEmailService.instance;
    }
}
exports.ProjectEmailService = ProjectEmailService;
