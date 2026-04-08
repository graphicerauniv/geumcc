import { NextRequest, NextResponse } from "next/server";
import {
    DATATEST_AUTH_COOKIE,
    isDatatestConfigured,
    isDatatestSessionValid,
} from "@/lib/services/datatest-auth";

export async function GET(request: NextRequest) {
    if (!isDatatestConfigured()) {
        return NextResponse.json(
            {
                authenticated: false,
                configured: false,
                message:
                    "Datatest login is not configured. Set DATATEST_LOGIN_ID and DATATEST_PASSWORD in .env.local",
            },
            { status: 200 }
        );
    }

    const cookieValue = request.cookies.get(DATATEST_AUTH_COOKIE)?.value;
    const authenticated = isDatatestSessionValid(cookieValue);

    return NextResponse.json({
        authenticated,
        configured: true,
    });
}

