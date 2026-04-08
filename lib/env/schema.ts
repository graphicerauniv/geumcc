import { z } from "zod";

export const serverEnvSchema = z.object({
    MONGODB_URI: z.string().optional(),
    MONGODB_DB: z.string().optional(),
    MSG91_AUTH_KEY: z.string().optional(),
    SMTP_USERNAME: z.string().optional(),
    SMTP_PASSWORD: z.string().optional(),
    DATATEST_LOGIN_ID: z.string().optional(),
    DATATEST_PASSWORD: z.string().optional(),
    DATATEST_USERNAME: z.string().optional(),
    DATATEST_PASS: z.string().optional(),
});

export const clientEnvSchema = z.object({});

export type ServerEnv = z.infer<typeof serverEnvSchema>;
export type ClientEnv = z.infer<typeof clientEnvSchema>;
