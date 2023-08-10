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
exports.imageRoute = void 0;
const express_1 = require("express");
const axios_1 = __importDefault(require("axios"));
const url_1 = __importDefault(require("url"));
require('dotenv').config();
exports.imageRoute = (0, express_1.Router)();
// baseUrl/nasa?start_date=2022-10-26&end_date=2022-11-9
exports.imageRoute.get('/nasa', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const URL = process.env.NASA_BASE_URL;
    const KEY = process.env.NASA_API_KEY;
    try {
        const dynamicURLParams = url_1.default.parse(req.url, true).query;
        console.log(dynamicURLParams);
        const CONFIG = {
            params: { api_key: KEY, start_date: dynamicURLParams.start_date, end_date: dynamicURLParams.end_date },
        };
        const request = yield axios_1.default.get(URL, CONFIG);
        if (request.status === 200) {
            const response = yield request.data.reverse(); // reversing so today's image shows first
            res.status(200).json(response);
        }
        else {
            res.status(400).json({ err: `Failed with status code: ${request.status}, Text: ${request.statusText}` });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ err });
    }
}));
