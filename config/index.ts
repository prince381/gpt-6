import * as dotenv from 'dotenv';

dotenv.config();

interface ConfigInterface {
    SERVER_PORT: string;
    NODE_ENV: string;
    ORIGIN: string;
    GPT35_KEY: string;
    GPT4_KEY: string;
    SUPABASE_URL: string;
    SUPABASE_KEY: string;
}

export const config: ConfigInterface = {
    SERVER_PORT: process.env.PORT || '',
    NODE_ENV: process.env.NODE_ENV || '',
    ORIGIN: process.env.ORIGIN || '',
    GPT35_KEY: process.env.GPT35_KEY || '',
    GPT4_KEY: process.env.GPT4_KEY || '',
    SUPABASE_URL: process.env.SUPABASE_URL || '',
    SUPABASE_KEY: process.env.SUPABASE_KEY || '',
};
