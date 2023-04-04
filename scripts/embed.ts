import * as fs from 'fs';
import * as path from 'path';
import { config } from '../config';
import { Configuration, OpenAIApi } from 'openai';
import { encode } from "gpt-3-encoder";
import {createClient} from '@supabase/supabase-js';

const configuration = new Configuration({
    apiKey: config.GPT4_KEY
});

const openai = new OpenAIApi(configuration);

const file = fs.readFileSync(path.resolve(__dirname, 'context/knowledge.txt'), 'utf8');

const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);

const generateEmbeddings = async (sentence: string) => {
    try {
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: sentence
        });
        const [{ embedding }] = response.data.data;
        return embedding;
    } catch (error) {
        console.error(error);
    }
};

function getChunks(stream: string) {
    let textChunks: string[] = [];

    if (encode(stream).length > 200) {
        const sentences = stream.split('. ');
        let chunk = '';

        for (let i = 0; i < sentences.length; i++) {
            const sentence = sentences[i];
            const senetenceTokenLength = encode(sentence).length;
            const chunkTokenLength = encode(chunk).length;

            if (senetenceTokenLength + chunkTokenLength > 200) {
                textChunks.push(chunk);
                chunk = '';
            }

            if (sentence[sentence.length - 1].match(/[a-z0-9]/i)) {
                chunk += `${sentence}. `;
            } else {
                chunk += sentence;
            }
        }

        textChunks.push(chunk.trim());
    } else {
        textChunks.push(stream.trim());
    }

    return textChunks;
}

const chunksTask = getChunks(file).map((chunk, index) => {
    return new Promise(async (resolve, reject) => {
        const embedding = await generateEmbeddings(chunk);
        const { data, error } = await supabase
            .from('gpt_embedding')
            .insert([
                {
                    id: index,
                    embedding: embedding,
                    sentence: chunk,
                    tokens: encode(chunk).length
                }
            ]);

        if (error) {
            reject(error);
        }
        await new Promise(resolve => setTimeout(resolve, 3000));
        resolve(data);
    });
});

const main = async () => {
    try {
        const uploaded = await Promise.all(chunksTask);
        console.log('Done', uploaded);
    } catch (error) {
        console.error(error);
    }
};

main();