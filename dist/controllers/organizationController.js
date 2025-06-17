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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const sendgrid = __importStar(require("../email/sendgrid"));
const interfaces_1 = require("../interfaces");
const env_loader_1 = require("../env/env.loader");
const logger_1 = __importDefault(require("../logger"));
const admin_1 = require("../functions/admin");
let OrganizationController = class OrganizationController {
    constructor() {
        this.admin = admin_1.FirebaseAdmin.getInstance();
        this.supportEmail = env_loader_1.EnvLoader.get('SUPPORT_EMAIL');
        this.emailService = sendgrid.EmailService.getInstance();
        this.admin = admin_1.FirebaseAdmin.getInstance();
    }
    deActivateOrg(deactivateProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orgName, userEmail, userName } = deactivateProps;
            if (!orgName || !userEmail || !userName) {
                throw new Error('Input Validation Error.');
            }
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Dactivation email processing for ${userEmail}`);
            const sendEmailProps = Object.assign(Object.assign({}, deactivateProps), { type: interfaces_1.EmailType.DEACTIVATE_ORG, supportEmail: this.supportEmail });
            yield this.emailService.orgDeactivationEmail(sendEmailProps);
            return { sussess: true };
        });
    }
    deleteOrg(deleteOrgProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orgName, userEmail, userName } = deleteOrgProps;
            if (!orgName || !userEmail || !userName) {
                throw new Error('Input Validation Error.');
            }
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Deleteing Org email processing for ${userEmail}`);
            const sendEmailProps = Object.assign(Object.assign({}, deleteOrgProps), { type: interfaces_1.EmailType.DELETE_ORG, supportEmail: this.supportEmail });
            yield this.emailService.deleteOrgEmail(sendEmailProps);
            return { sussess: true };
        });
    }
    activeOrg(props) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orgName, userEmail, userName } = props;
            if (!orgName || !userEmail || !userName) {
                throw new Error('Input Validation Error');
            }
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Actiavting Org email processing for ${userEmail}`);
            const link = env_loader_1.EnvLoader.getOrThrow('BASE_URL') + `/my_projects?redirect=true`;
            const sendEmailProps = Object.assign(Object.assign({}, props), { dashboardLink: link, type: interfaces_1.EmailType.ACTIVATE_ORG });
            console.log(link);
            yield this.emailService.orgActivation(sendEmailProps);
            return { success: true };
        });
    }
};
__decorate([
    (0, routing_controllers_1.Post)('/deactivate'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deActivateOrg", null);
__decorate([
    (0, routing_controllers_1.Post)('/delete'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "deleteOrg", null);
__decorate([
    (0, routing_controllers_1.Post)('/active'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "activeOrg", null);
OrganizationController = __decorate([
    (0, routing_controllers_1.JsonController)('/organizations'),
    __metadata("design:paramtypes", [])
], OrganizationController);
exports.default = OrganizationController;
