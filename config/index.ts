import * as dotenv from 'dotenv';

dotenv.config();

interface ConfigInterface {
    SERVER_PORT: string;
    NODE_ENV: string;
    ORIGIN: string;
    OPENAI_KEY: string;
}

export const config: ConfigInterface = {
    SERVER_PORT: process.env.PORT || '',
    NODE_ENV: process.env.NODE_ENV || '',
    ORIGIN: process.env.ORIGIN || '',
    OPENAI_KEY: process.env.OPENAI_KEY || ''
};
