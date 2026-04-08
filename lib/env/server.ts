import { serverEnvSchema, type ServerEnv } from "./schema";

function normalizeMongoUri(raw?: string): string | undefined {
    if (!raw) return raw;

    let value = raw.trim().replace(/^['"]|['"]$/g, "");

    // Recover from accidental nested assignments like:
    // MONGODB_URI=MONGO_URI=mongodb+srv://...
    if (!value.startsWith("mongodb://") && !value.startsWith("mongodb+srv://")) {
        const parts = value.split("=");
        const candidate = parts[parts.length - 1]?.trim();
        if (
            candidate &&
            (candidate.startsWith("mongodb://") ||
                candidate.startsWith("mongodb+srv://"))
        ) {
            value = candidate;
        }
    }

    return value;
}

const serverEnv = serverEnvSchema.parse({
    MONGODB_URI: normalizeMongoUri(process.env.MONGODB_URI),
    MONGODB_DB: process.env.MONGODB_DB?.trim(),
    MSG91_AUTH_KEY:
        process.env.MSG91_AUTH_KEY?.trim() ||
        process.env.MSG91_AUTHKEY?.trim(),
    SMTP_USERNAME: process.env.SMTP_USERNAME?.trim(),
    SMTP_PASSWORD: process.env.SMTP_PASSWORD?.trim(),
    DATATEST_LOGIN_ID:
        process.env.DATATEST_LOGIN_ID?.trim() ||
        process.env.DATATEST_USERNAME?.trim(),
    DATATEST_PASSWORD:
        process.env.DATATEST_PASSWORD?.trim() ||
        process.env.DATATEST_PASS?.trim(),
    DATATEST_USERNAME: process.env.DATATEST_USERNAME?.trim(),
    DATATEST_PASS: process.env.DATATEST_PASS?.trim(),
});

export { serverEnv };
export type { ServerEnv };
