"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const routes_1 = require("./routes");
require('dotenv').config();
const PORT = process.env.PORT || 5000;
const app = (0, express_1.default)();
// Enable Cors
app.use((0, cors_1.default)());
// Rate Limiting Middleware
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);
app.set('Trust Proxy', 1);
// Set Static Folder
app.use(express_1.default.static('public'));
// Import Routes
app.use('/', routes_1.routes);
// Start Proxy
app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});
