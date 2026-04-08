import { NextRequest, NextResponse } from "next/server";
import {
    DATATEST_AUTH_COOKIE,
    getDatatestSessionToken,
    isDatatestConfigured,
    verifyDatatestCredentials,
} from "@/lib/services/datatest-auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const loginId = String(body?.loginId || "").trim();
        const password = String(body?.password || "").trim();

        if (!isDatatestConfigured()) {
            return NextResponse.json(
                {
                    message:
                        "Datatest login is not configured. Set DATATEST_LOGIN_ID and DATATEST_PASSWORD in .env.local",
                },
                { status: 500 }
            );
        }

        if (!loginId || !password) {
            return NextResponse.json(
                { message: "Login ID and password are required" },
                { status: 400 }
            );
        }

        if (!verifyDatatestCredentials(loginId, password)) {
            return NextResponse.json(
                { message: "Invalid login ID or password" },
                { status: 401 }
            );
        }

        const token = getDatatestSessionToken();
        if (!token) {
            return NextResponse.json(
                { message: "Datatest session token could not be created" },
                { status: 500 }
            );
        }
        const response = NextResponse.json({ message: "Login successful" });
        response.cookies.set({
            name: DATATEST_AUTH_COOKIE,
            value: token as string,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 8,
        });

        return response;
    } catch (error) {
        console.error("Datatest login error:", error);
        return NextResponse.json(
            { message: "Failed to login" },
            { status: 500 }
        );
    }
}
