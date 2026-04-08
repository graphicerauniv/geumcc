import { createHash } from "crypto";
import { serverEnv } from "@/lib/env/server";

export const DATATEST_AUTH_COOKIE = "mcc_datatest_auth";

function buildAuthToken(loginId: string, password: string): string {
    return createHash("sha256")
        .update(`${loginId}:${password}`)
        .digest("hex");
}

export function isDatatestConfigured(): boolean {
    return Boolean(serverEnv.DATATEST_LOGIN_ID && serverEnv.DATATEST_PASSWORD);
}

export function verifyDatatestCredentials(
    loginId: string,
    password: string
): boolean {
    if (!isDatatestConfigured()) return false;

    const normalizedLoginId = loginId.trim();
    const normalizedPassword = password.trim();

    return (
        normalizedLoginId === serverEnv.DATATEST_LOGIN_ID &&
        normalizedPassword === serverEnv.DATATEST_PASSWORD
    );
}

export function getDatatestSessionToken(): string | null {
    if (!isDatatestConfigured()) return null;

    return buildAuthToken(
        serverEnv.DATATEST_LOGIN_ID as string,
        serverEnv.DATATEST_PASSWORD as string
    );
}

export function isDatatestSessionValid(cookieValue?: string): boolean {
    if (!cookieValue) return false;

    const token = getDatatestSessionToken();
    if (!token) return false;

    return cookieValue === token;
}
