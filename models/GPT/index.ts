import { config } from "../../config";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import {createClient} from '@supabase/supabase-js';


class Query {
    async query(completions: ChatCompletionRequestMessage[]) {
        console.log(`Prompts: ${completions}`)
        const configuration = new Configuration({
            apiKey: config.OPENAI_KEY
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createChatCompletion({
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
    }

    async createEmbedding(sentence: string) {
        const configuration = new Configuration({
            apiKey: config.OPENAI_KEY
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createEmbedding({
            model: 'text-embedding-ada-002',
            input: sentence
        });
        const [{ embedding }] = response.data.data;
        
        const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_KEY);
        const { data, error } = await supabase.rpc('search_sm', {
            query_embedding: embedding,
            similarity_threshold: 0.7,
            match_count: 2
        });

        if (error) {
            console.error(error);
        }

        // console.log(data);
        return data;
    }
}

export default new Query();