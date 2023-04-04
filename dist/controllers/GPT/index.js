"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const GPT_1 = __importDefault(require("../../models/GPT"));
const config_1 = require("../../config");
const node_fetch_1 = __importDefault(require("node-fetch"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class GPT {
    query(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { prompts, geoInfo } = req.body;
            const premiumCountries = ['CA', 'US', 'AU', 'GB', 'GH', 'NZ', 'JP', 'DE'];
            if (!prompts || prompts.length === 0)
                return res.status(422).send('Bad request!');
            res.setHeader('Content-Type', 'text/event-stream');
            const url = "https://api.openai.com/v1/chat/completions";
            const requestConfig = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${premiumCountries.includes(geoInfo.country) ?
                        config_1.config.GPT35_KEY : config_1.config.GPT4_KEY}`
                }
            };
            // console.log(geoInfo)
            // console.log('\n')
            const systemPrompt = fs.readFileSync(path.resolve(__dirname, 'context/knowledge.txt'), 'utf8');
            const completions = [];
            completions.push({ content: systemPrompt, role: 'system' });
            if (!premiumCountries.includes(geoInfo.country)) {
                const promptHistory = prompts.length > 1 ? prompts.slice(-2) : prompts;
                promptHistory.forEach((prompt) => {
                    completions.push(prompt);
                });
            }
            else {
                prompts.forEach((prompt) => {
                    completions.push(prompt);
                });
            }
            // console.log(completions)
            const payload = {
                model: premiumCountries.includes(geoInfo.country) ? "gpt-4" : "gpt-3.5-turbo",
                messages: completions,
                temperature: 0.5,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0,
                max_tokens: 600,
                stream: true,
                n: 1,
            };
            (0, node_fetch_1.default)(url, {
                method: 'POST',
                headers: requestConfig.headers,
                body: JSON.stringify(payload)
            }).then(response => {
                var _a, _b;
                (_a = response.body) === null || _a === void 0 ? void 0 : _a.pipe(res);
                // response.body.on('data', (data) => console.log('data received', data.toString()));
                (_b = response.body) === null || _b === void 0 ? void 0 : _b.on('end', () => console.log('Done...'));
            }).catch(err => {
                console.error(err);
            });
        });
    }
    createEmbedding(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { sentence } = req.body;
            if (!sentence)
                return res.status(422).send('Bad request!');
            try {
                const response = yield GPT_1.default.createEmbedding(sentence);
                return res.status(200).send(response);
            }
            catch (error) {
                console.log(error);
            }
        });
    }
}
exports.default = new GPT();
