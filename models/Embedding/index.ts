import { HNSWLib } from 'langchain/vectorstores';
import { OpenAIEmbeddings } from 'langchain/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/dist/text_splitter';
import { TextLoader } from 'langchain/document_loaders';
import path from "path";

const FILENAME = "/data/train/knowledge.txt";

export const run = async () => {
    const loader = new TextLoader(path.resolve(__dirname, FILENAME));
    const rawDocs = await loader.load();
    console.log('Loader created.');

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkOverlap: 200,
        chunkSize: 1000
    });
    const docs = await textSplitter.splitDocuments(rawDocs);
    console.log('Docs splitted.');

    console.log('Creating your vector store...');
    
    const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
    await vectorStore.save(path.resolve(__dirname, '/data/context/context'));
}