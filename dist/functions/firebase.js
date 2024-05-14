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
exports.FirebaseFunctions = void 0;
var admin_1 = require("./admin");
var FirebaseFunctions = /** @class */ (function () {
    function FirebaseFunctions() {
        var _this = this;
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        this.admin = admin_1.FirebaseAdmin.getInstance();
        this.createUser = function (userInput) { return __awaiter(_this, void 0, void 0, function () {
            var user, verifyLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.admin.app.auth().createUser({
                            email: userInput === null || userInput === void 0 ? void 0 : userInput.email,
                            password: userInput === null || userInput === void 0 ? void 0 : userInput.password,
                        })];
                    case 1:
                        user = _a.sent();
                        return [4 /*yield*/, this.setUserClaims(user.uid, user.email)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.generateVerificationLink(userInput.email)];
                    case 3:
                        verifyLink = _a.sent();
                        // logger.debug(`verifyLink: ${verifyLink}`);
                        return [2 /*return*/, verifyLink];
                }
            });
        }); };
        this.generateVerificationLink = function (email) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.admin.app.auth().generateEmailVerificationLink(email)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        }); };
        this.resetPassword = function (email) { return __awaiter(_this, void 0, void 0, function () {
            var passwordResetLink;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.admin.app
                            .auth()
                            .generatePasswordResetLink(email)];
                    case 1:
                        passwordResetLink = _a.sent();
                        // logger.debug(`Password-Reset Link: ${passwordResetLink}`);
                        return [2 /*return*/, passwordResetLink];
                }
            });
        }); };
        this.setUserClaims = function (userId, email) { return __awaiter(_this, void 0, void 0, function () {
            var roles;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!userId || !email)
                            throw new Error('Invalid userId or Email');
                        roles = this.getRoleByEmail(email);
                        return [4 /*yield*/, this.admin.app.auth().setCustomUserClaims(userId, { roles: roles })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, roles];
                }
            });
        }); };
        this.admin = admin_1.FirebaseAdmin.getInstance();
    }
    FirebaseFunctions.prototype.isCompanyEmail = function (email) {
        if (!email)
            return false;
        return email.endsWith('@agilenaustics.com');
    };
    FirebaseFunctions.prototype.getRoleByEmail = function (email) {
        if (this.isCompanyEmail(email)) {
            return ['SYSTEM_ADMIN'];
        }
        return ['USER'];
    };
    FirebaseFunctions.getInstance = function () {
        if (!FirebaseFunctions.instance) {
            FirebaseFunctions.instance = new FirebaseFunctions();
        }
        return FirebaseFunctions.instance;
    };
    return FirebaseFunctions;
}());
exports.FirebaseFunctions = FirebaseFunctions;
