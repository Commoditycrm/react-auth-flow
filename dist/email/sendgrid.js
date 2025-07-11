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
    orgDeactivationEmail(emailDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orgName, type, userEmail, userName, supportEmail } = emailDetail;
            const sendgridMessage = {
                to: userEmail,
                from: EmailService.instance.from,
                templateId: env_loader_1.EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
                dynamicTemplateData: {
                    userName,
                    orgName,
                    supportEmail,
                },
            };
            try {
                yield mail_1.default.send(sendgridMessage);
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Deactivation email sent successfully to ${userEmail} for organization ${orgName}`);
                return true;
            }
            catch (error) {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`Failed to send deactivation email to ${userEmail} for organization  ${orgName}: ${error} `);
                throw new Error(`While deactivating the org ${error}`);
            }
        });
    }
    orgActivation(emailDetail) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dashboardLink, orgName, type, userEmail, userName } = emailDetail;
            const sendgridMessage = {
                from: EmailService.instance.from,
                to: userEmail,
                templateId: env_loader_1.EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
                dynamicTemplateData: {
                    userName,
                    orgName,
                    dashboardLink,
                },
            };
            try {
                yield mail_1.default.send(sendgridMessage);
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Activation email sent successfully to ${userEmail} for organization ${orgName}`);
                return true;
            }
            catch (error) {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`iled to activate Org:${error}`);
                throw new Error(`Filed to activate Org:${error}`);
            }
        });
    }
    deleteOrgEmail(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orgName, supportEmail, type, userEmail, userName } = params;
            const sendgridMessage = {
                to: userEmail,
                from: this.from,
                templateId: env_loader_1.EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
                dynamicTemplateData: {
                    orgName,
                    userName,
                    supportEmail,
                },
            };
            try {
                yield mail_1.default.send(sendgridMessage);
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Deleting Org email sent successfully to ${userEmail} for organization ${orgName}`);
                return true;
            }
            catch (error) {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`Failed to send delete org email to ${userEmail} for organization  ${orgName}:${error}`);
                throw new Error(`While sending email for deleting org`);
            }
        });
    }
    //Project removal email
    removeUserFromProject(removeserPops) {
        return __awaiter(this, void 0, void 0, function* () {
            const { userEmail, userName, projectName, orgName, type } = removeserPops;
            const sendgridMessage = {
                to: userEmail,
                from: this.from,
                templateId: env_loader_1.EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
                dynamicTemplateData: {
                    userName,
                    projectName,
                    orgName,
                },
                subject: `You've been removed from ${projectName}`,
            };
            try {
                yield mail_1.default.send(sendgridMessage);
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Project removal email sent to ${userEmail}.`);
                return true;
            }
            catch (error) {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`Failed to send project removal email to ${userEmail} for project ${projectName}: ${error.message}`);
                throw new Error(`Error sending removal email to ${userEmail} for project ${projectName}`);
            }
        });
    }
    reminders(emailProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dashboardLink, taskCount, type, userEmail, userName } = emailProps;
            const sendgridMessage = {
                from: this.from,
                to: userEmail,
                templateId: env_loader_1.EnvLoader.getOrThrow(`${type}_TEMPLATE_ID`),
                dynamicTemplateData: {
                    dashboardLink,
                    taskCount,
                    userName,
                },
            };
            try {
                yield mail_1.default.send(sendgridMessage);
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`✅ Reminder email sent successfully to user: ${userEmail}`);
                return true;
            }
            catch (error) {
                logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.error(`While sending reminder:${error}`);
                throw new Error(`Field to send reminder`);
            }
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
    static getInstance() {
        if (!ProjectEmailService.instance) {
            ProjectEmailService.instance = new ProjectEmailService();
            mail_1.default.setApiKey(ProjectEmailService.instance.apiKey);
        }
        return ProjectEmailService.instance;
    }
}
exports.ProjectEmailService = ProjectEmailService;
