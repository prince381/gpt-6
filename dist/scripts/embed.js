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
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const config_1 = require("../config");
const openai_1 = require("openai");
const gpt_3_encoder_1 = require("gpt-3-encoder");
const supabase_js_1 = require("@supabase/supabase-js");
const configuration = new openai_1.Configuration({
    apiKey: config_1.config.OPENAI_KEY
});
const openai = new openai_1.OpenAIApi(configuration);
const file = fs.readFileSync(path.resolve(__dirname, 'context/knowledge.txt'), 'utf8');
const supabase = (0, supabase_js_1.createClient)(config_1.config.SUPABASE_URL, config_1.config.SUPABASE_KEY);
const generateEmbeddings = (sentence) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: sentence
        });
        const [{ embedding }] = response.data.data;
        return embedding;
    }
    catch (error) {
        console.error(error);
    }
});
function getChunks(stream) {
    let textChunks = [];
    if ((0, gpt_3_encoder_1.encode)(stream).length > 200) {
        const sentences = stream.split('. ');
        let chunk = '';
        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            const senetenceTokenLength = (0, gpt_3_encoder_1.encode)(sentence).length;
            const chunkTokenLength = (0, gpt_3_encoder_1.encode)(chunk).length;
            if (senetenceTokenLength + chunkTokenLength > 200) {
                textChunks.push(chunk);
                chunk = '';
            }
            if (sentence[sentence.length - 1].match(/[a-z0-9]/i)) {
                chunk += `${sentence}. `;
            }
            else {
                chunk += sentence;
            }
        }
        textChunks.push(chunk.trim());
    }
    else {
        textChunks.push(stream.trim());
    }
    return textChunks;
}
const chunksTask = getChunks(file).map((chunk, index) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        const embedding = yield generateEmbeddings(chunk);
        const { data, error } = yield supabase
            .from('gpt_embedding')
            .insert([
            {
                id: index,
                embedding: embedding,
                sentence: chunk,
                tokens: (0, gpt_3_encoder_1.encode)(chunk).length
            }
        ]);
        if (error) {
            reject(error);
        }
        yield new Promise(resolve => setTimeout(resolve, 3000));
        resolve(data);
    }));
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploaded = yield Promise.all(chunksTask);
        console.log('Done', uploaded);
    }
    catch (error) {
        console.error(error);
    }
});
main();
