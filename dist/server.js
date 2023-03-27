"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app/app.js"));
const index_js_1 = require("./config/index.js");
app_js_1.default.listen(index_js_1.config.SERVER_PORT, () => {
    console.log(`Listening on port ${index_js_1.config.SERVER_PORT} in ${index_js_1.config.NODE_ENV} mode`);
});
process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});
process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});
