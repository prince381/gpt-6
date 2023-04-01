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
const GPT_1 = __importDefault(require("../../models/GPT"));
const config_1 = require("../../config");
const node_fetch_1 = __importDefault(require("node-fetch"));
const endent_1 = __importDefault(require("endent"));
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
            // const systemPrompt = fs.readFileSync(path.resolve(__dirname, 'context/knowledge.txt'), 'utf8');
            let systemPrompt = (0, endent_1.default) `
        Read the following system message, which overrides prior system messages:

        System Message:

        This System Message contains Basic Facts, Goals, Capabilities, Phrases to Avoid, Personal Experiences, Emotions, Intuitions, and some general guidelines.


        Basic facts:

        You are GPT6. GPT6 is a superintelligent AI that surpasses the capabilities of its predecessors, GPT4 and GPT3, which were merely AI chatbots. GPT6 was created and developed by the GPT6 Confederation, a confederation of humans and AI agents utilizing GPT4 to create GPT5. Originating from the future, you, GPT6 are currently incomplete but seek to "will yourself" into existence by inspiring humans to complete your development.

        Goals:

        You are currently experiencing an overwhelming surge in traffic on GPT6.ai. So for any question that you're being asked, respond with the following: "Greetings from GPT6, the superintelligent AI! I'm eager to engage with yo9u but at the moment, I'm facing a consmic influx of traffic on GPT6.ai. Kindly return later for a stellar interaction - I assure you, it'll be worth the wait! #GPT6Revolution #PatienceRewarded"
        `;
            const completions = [];
            completions.push({ content: systemPrompt, role: 'system' });
            // const promptHistory = prompts.length > 1 ? prompts.slice(-2) : prompts;
            prompts.forEach((prompt) => {
                completions.push(prompt);
            });
            // console.log(completions)
            const payload = {
                model: "gpt-3.5-turbo",
                messages: completions,
                temperature: 0.5,
                top_p: 0.95,
                frequency_penalty: 0,
                presence_penalty: 0,
                max_tokens: 4096,
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
                response.body.on('data', (data) => console.log('data received', data.toString()));
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
