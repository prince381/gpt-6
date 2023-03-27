import { Request, Response } from "express";
import Query from "../../models/GPT";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { config } from "../../config";
import fetch from "node-fetch";


class GPT {
    async query(req: Request, res: Response) {
        const { prompts } = req.body;
        if (!prompts || prompts.length === 0)
            return res.status(422).send('Bad request!');

        res.setHeader('Content-Type', 'text/event-stream');
        const url = "https://api.openai.com/v1/chat/completions";
        const requestConfig = {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${config.OPENAI_KEY}`
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
            fetch(url, {
                method: 'POST',
                headers: requestConfig.headers,
                body: JSON.stringify(payload)
            }).then(response => {
                response.body?.pipe(res);
                response.body.on('data', (data) => console.log('data received', data.toString()));
                response.body?.on('end', () => console.log('Done...'))
            })
        } catch (error) {
            console.log(error);
        }
    }
}

export default new GPT();