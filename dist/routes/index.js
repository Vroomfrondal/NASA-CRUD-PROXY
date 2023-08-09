"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const express_1 = require("express");
const images_1 = require("./images");
const email_1 = require("./email");
exports.routes = (0, express_1.Router)();
// Routes
exports.routes.use(images_1.imageRoute);
exports.routes.use(email_1.emailRoute);
