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
exports.run = void 0;
const vectorstores_1 = require("langchain/vectorstores");
const embeddings_1 = require("langchain/embeddings");
const text_splitter_1 = require("langchain/dist/text_splitter");
const document_loaders_1 = require("langchain/document_loaders");
const path_1 = __importDefault(require("path"));
const FILENAME = "/data/train/knowledge.txt";
const run = () => __awaiter(void 0, void 0, void 0, function* () {
    const loader = new document_loaders_1.TextLoader(path_1.default.resolve(__dirname, FILENAME));
    const rawDocs = yield loader.load();
    console.log('Loader created.');
    const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
        chunkOverlap: 200,
        chunkSize: 1000
    });
    const docs = yield textSplitter.splitDocuments(rawDocs);
    console.log('Docs splitted.');
    console.log('Creating your vector store...');
    const vectorStore = yield vectorstores_1.HNSWLib.fromDocuments(docs, new embeddings_1.OpenAIEmbeddings());
    yield vectorStore.save(path_1.default.resolve(__dirname, '/data/context/context'));
});
exports.run = run;
