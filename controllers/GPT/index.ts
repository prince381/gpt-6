import { Request, Response } from "express";
import Query from "../../models/GPT";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { config } from "../../config";
import fetch from "node-fetch";
import * as fs from 'fs';
import * as path from 'path';
import endent from "endent";


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

        const systemPrompt = fs.readFileSync(path.resolve(__dirname, 'context/knowledge.txt'), 'utf8');

        const completions: ChatCompletionRequestMessage[] = [];
        completions.push({ content: systemPrompt, role: 'system' });
        const promptHistory = prompts.length > 1 ? prompts.slice(-2) : prompts;
        promptHistory.forEach((prompt: ChatCompletionRequestMessage) => {
            completions.push(prompt);
        });

        console.log(completions)

        const payload = {
            model: "gpt-3.5-turbo",
            messages: completions,
            temperature: 0.5,
            top_p: 0.95,
            frequency_penalty: 0,
            presence_penalty: 0,
            max_tokens: 2500,
            stream: true,
            n: 1,
        };

        fetch(url, {
            method: 'POST',
            headers: requestConfig.headers,
            body: JSON.stringify(payload)
        }).then(response => {
            response.body?.pipe(res);
            // response.body.on('data', (data) => console.log('data received', data.toString()));
            response.body?.on('end', () => console.log('Done...'))
        }).catch(err => {
            console.error(err);
        });
    }

    async createEmbedding(req: Request, res: Response) {
        const { sentence } = req.body;
        if (!sentence)
            return res.status(422).send('Bad request!');

        try {
            const response = await Query.createEmbedding(sentence);
            return res.status(200).send(response);
        } catch (error) {
            console.log(error);
        }
    }
    
    // async query(req: Request, res: Response) {
    //     const { prompts } = req.body;
    //     if (!prompts || prompts.length === 0)
    //         return res.status(422).send('Bad request!');

    //     res.setHeader('Content-Type', 'text/event-stream');
    //     const url = "https://api.openai.com/v1/chat/completions";
    //     const requestConfig = {
    //         headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${config.OPENAI_KEY}`
    //         }
    //     };
    
    //     Query.createEmbedding(prompts.slice(-1)[0].content)
    //     .then((data) => {
    //         let systemPrompt = data.map((item: any) => item.sentence).join(' ');
    //         systemPrompt = endent`
    //         Use the information provided to you below, to answer any questions you may be given. Make sure you stick to the content in the information provided and do not make up any information. If you are asked a question that has no information in the data provided, you can answer with "I don't know the answer to this question. I'm sorry I couldn't be of much help". This is the information provided to you:

    //         "${systemPrompt}"
    //         `
    //         console.log(systemPrompt);

    //         const completions: ChatCompletionRequestMessage[] = [];
    //         completions.push({ content: systemPrompt, role: 'system' });
    //         prompts.forEach((prompt: ChatCompletionRequestMessage) => {
    //             completions.push(prompt);
    //         });

    //         const payload = {
    //             model: "gpt-3.5-turbo",
    //             messages: completions,
    //             temperature: 0.5,
    //             top_p: 0.95,
    //             frequency_penalty: 0,
    //             presence_penalty: 0,
    //             max_tokens: 2500,
    //             stream: true,
    //             n: 1,
    //         };

    //         fetch(url, {
    //             method: 'POST',
    //             headers: requestConfig.headers,
    //             body: JSON.stringify(payload)
    //         }).then(response => {
    //             response.body?.pipe(res);
    //             // response.body.on('data', (data) => console.log('data received', data.toString()));
    //             response.body?.on('end', () => console.log('Done...'))
    //         })
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     })
    // }
}

export default new GPT();