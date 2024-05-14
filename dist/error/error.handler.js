"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomErrorHandler = void 0;
var routing_controllers_1 = require("routing-controllers");
var error_codes_1 = require("./error.codes");
var CustomErrorHandler = /** @class */ (function () {
    function CustomErrorHandler() {
    }
    CustomErrorHandler.prototype.error = function (err, req, res) {
        if ((err === null || err === void 0 ? void 0 : err.code) && error_codes_1.FIREBASE_ERROR_CODES[err.code]) {
            var error = error_codes_1.FIREBASE_ERROR_CODES[err.code];
            var specificErrorMessage = error_codes_1.ERROR_MESSAGES[error.errorCode];
            return res.status(403).json({
                code: error.errorCode,
                message: specificErrorMessage,
            });
        }
        // logger.error(`Execution failed: ${err}`);
        var errorMessage = error_codes_1.ERROR_MESSAGES.INTERNAL_SERVER_ERROR;
        return res.status(500).json({
            code: 'INTERNAL_SERVER_ERROR',
            message: errorMessage,
        });
    };
    CustomErrorHandler = __decorate([
        (0, routing_controllers_1.Middleware)({ type: 'after', priority: 100 })
    ], CustomErrorHandler);
    return CustomErrorHandler;
}());
exports.CustomErrorHandler = CustomErrorHandler;
