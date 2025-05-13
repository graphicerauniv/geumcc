import { clientEnvSchema, type ClientEnv } from "./schema";

const clientEnv = clientEnvSchema.parse({});

export { clientEnv };
export type { ClientEnv };
