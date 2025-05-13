import { z } from "zod";

export const serverEnvSchema = z.object({
    MONGODB_URI: z.string(),
    MONGODB_DB: z.string(),
    TEXT_LOCAL_API_KEY: z.string(),
    SMTP_USERNAME: z.string(),
    SMTP_PASSWORD: z.string(),
});

export const clientEnvSchema = z.object({});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
