import { serverEnvSchema, type ServerEnv } from "./schema";

const serverEnv = serverEnvSchema.parse({
    MONGODB_URI: process.env.MONGODB_URI,
    MONGODB_DB: process.env.MONGODB_DB,
    MSG91_AUTH_KEY: process.env.MSG91_AUTH_KEY,
    SMTP_USERNAME: process.env.SMTP_USERNAME,
    SMTP_PASSWORD: process.env.SMTP_PASSWORD,
});

export { serverEnv };
export type { ServerEnv };
