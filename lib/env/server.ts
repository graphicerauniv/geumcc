import { serverEnvSchema, type ServerEnv } from "./schema";

const serverEnv = serverEnvSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    TEXT_LOCAL_API_KEY: process.env.TEXT_LOCAL_API_KEY,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
});

export { serverEnv };
export type { ServerEnv };
