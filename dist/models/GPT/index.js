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
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../../config");
const openai_1 = require("openai");
class Query {
    query(completions) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`Prompts: ${completions}`);
            const configuration = new openai_1.Configuration({
                apiKey: config_1.config.OPENAI_KEY
            });
            const openai = new openai_1.OpenAIApi(configuration);
            const response = yield openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: completions,
                temperature: 0.5,
                max_tokens: 3089,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stream: true
            });
            return response;
        });
    }
}
exports.default = new Query();
