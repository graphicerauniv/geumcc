import { NextResponse } from "next/server";
import { DATATEST_AUTH_COOKIE } from "@/lib/services/datatest-auth";

export async function POST() {
    const response = NextResponse.json({ message: "Logout successful" });
    response.cookies.set({
        name: DATATEST_AUTH_COOKIE,
        value: "",
        path: "/",
        maxAge: 0,
    });
    return response;
}

