"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const baseRouter_1 = __importDefault(require("../router/baseRouter"));
const express = require('express');
const app = express();
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Methods",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Headers",
        "Accept",
    ],
};
app.options("*", (0, cors_1.default)(corsOptions));
app.use((0, cors_1.default)(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", baseRouter_1.default);
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'server is listening for requests.'
    });
});
exports.default = app;
