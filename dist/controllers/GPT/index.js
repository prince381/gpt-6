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
const config_1 = require("../../config");
const node_fetch_1 = __importDefault(require("node-fetch"));
class GPT {
    query(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { prompts } = req.body;
            if (!prompts || prompts.length === 0)
                return res.status(422).send('Bad request!');
            res.setHeader('Content-Type', 'text/event-stream');
            const url = "https://api.openai.com/v1/chat/completions";
            const requestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${config_1.config.OPENAI_KEY}`
                }
            };
            const payload = {
                model: "gpt-3.5-turbo",
                messages: prompts,
                temperature: 0.5,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0,
                max_tokens: 20,
                stream: true,
                n: 1,
            };
            try {
                (0, node_fetch_1.default)(url, {
                    method: 'POST',
                    headers: requestConfig.headers,
                    body: JSON.stringify(payload)
                }).then(response => {
                    var _a, _b;
                    (_a = response.body) === null || _a === void 0 ? void 0 : _a.pipe(res);
                    response.body.on('data', (data) => console.log('data received', data.toString()));
                    (_b = response.body) === null || _b === void 0 ? void 0 : _b.on('end', () => console.log('Done...'));
                });
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new GPT();