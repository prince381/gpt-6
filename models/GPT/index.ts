import { config } from "../../config";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";


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
}

export default new Query();