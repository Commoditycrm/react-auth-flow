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
const logger_1 = __importDefault(require("../logger"));
const env_loader_1 = require("../env/env.loader");
let EventController = class EventController {
    constructor() {
        this.emailService = sendgrid.EmailService.getInstance();
    }
    removeUserFromProject(eventBodyProps) {
        return __awaiter(this, void 0, void 0, function* () {
            const { orgName, projectName, userName, orgOwnerEmail, projectOwnerEmail, description, path, title, } = eventBodyProps;
            if (!orgName ||
                !projectName ||
                !userName ||
                !orgOwnerEmail ||
                !projectOwnerEmail ||
                !path) {
                throw Error('Input Validation Error');
            }
            const url = `${env_loader_1.EnvLoader.getOrThrow('BASE_URL')}${path}?redirect=true`;
            const sendEmailProps = Object.assign(Object.assign({}, eventBodyProps), { description: description !== null && description !== void 0 ? description : '-No Description-', type: interfaces_1.EmailType.CREATE_EVENT, url });
            yield this.emailService.createEvent(sendEmailProps);
            logger_1.default === null || logger_1.default === void 0 ? void 0 : logger_1.default.info(`Event email triggered — 
   Title: "${title}", 
   Recipients: ${orgOwnerEmail} and ${projectOwnerEmail}, 
   Redirect URL: ${url}`);
            return { success: true };
        });
    }
};
__decorate([
    (0, routing_controllers_1.Post)('/create-event'),
    __param(0, (0, routing_controllers_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventController.prototype, "removeUserFromProject", null);
EventController = __decorate([
    (0, routing_controllers_1.JsonController)(),
    __metadata("design:paramtypes", [])
], EventController);
exports.default = EventController;
