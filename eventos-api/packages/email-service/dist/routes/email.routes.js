"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const email_middleware_1 = __importDefault(require("../middlewares/email.middleware"));
const emailController_1 = __importDefault(require("../controllers/emailController"));
const router = (0, express_1.Router)();
router.post('/send', email_middleware_1.default, emailController_1.default.sendMail);
router.get("/protected", email_middleware_1.default, (req, res) => {
    res.status(200).json({ message: "Access granted" });
});
exports.default = router;
