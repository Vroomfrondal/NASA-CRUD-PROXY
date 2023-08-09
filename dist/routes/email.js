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
exports.emailRoute = void 0;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const axios_retry_1 = __importDefault(require("axios-retry"));
require('dotenv').config();
exports.emailRoute = (0, express_1.Router)();
// baseUrl/email/your_email_here
exports.emailRoute.get('/email/:user_email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const URL = process.env.EMAIL_URL;
    const SENDER = process.env.SENDER;
    const RECIEVER = req.params.user_email;
    const KEY = process.env.EMAIL_API_KEY;
    const CONFIG = {
        headers: { Authorization: KEY, 'Content-Type': 'application/json' },
        data: {
            from: { email: SENDER },
            subject: '60 Years of Nasa Spaceflight <PDF>',
            personalizations: [
                {
                    to: [{ email: RECIEVER }],
                    subject: 'Test',
                },
            ],
            attachments: [
                {
                    content: '',
                    filename: 'test.pdf',
                    type: 'application/pdf',
                    disposition: 'attachment',
                },
            ],
            content: [
                {
                    type: 'text/html',
                    value: `
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background-color: #f1f1f1; padding: 40px 0;">
                <div style="background-color: #ffffff; padding: 40px 30px;">
                    <h1 style="font-family: Arial, sans-serif; font-size: 24px; color: #333333; margin: 0;">
                        <b>Thank You for Requesting NASA's PDF Pamphlet</b>
                    </h1>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333; margin-top: 20px;">
                        Dear ${RECIEVER},
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333;">
                        We would like to express our gratitude for your interest in NASA's PDF pamphlet. We're excited to share this valuable resource with you.
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333;">
                        Your request was successful, and the PDF pamphlet is attached to this email. Please feel free to reach out if you have any questions or further inquiries using my email cjdeleon98@gmail.com.
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333;">
                        Thank you for your continued support and curiosity about space exploration! <b>Your email will not be saved or subscribed in anyway</b>.
                    </p>
                    <p style="font-family: Arial, sans-serif; font-size: 16px; line-height: 20px; color: #333333; margin-top: 20px;">
                        Best regards,<br>
                        Christopher
                      </p>
                  </div>
              </div>
          </div>
            `,
                },
            ],
        },
    };
    // Retry support
    (0, axios_retry_1.default)(axios_1.default, {
        retries: 3,
        retryDelay: axios_retry_1.default.exponentialDelay,
    });
    // Email Request
    const request = yield axios_1.default.post(URL, CONFIG.data, CONFIG);
    if (request.status === 202)
        res.status(200).json({ status: 200, message: `Email sent to ${SENDER}` });
    else
        res.status(400).json({ status: 400, message: 'Email encountered an issue.' });
}));