import { NextRequest, NextResponse } from "next/server";
import { createOTP, sendEmailOTP, sendSmsOTP } from "@/lib/services/otp";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { identifier, type } = body;

        if (!identifier) {
            return NextResponse.json(
                { message: "Identifier is required" },
                { status: 400 }
            );
        }

        if (!type || (type !== "EMAIL" && type !== "PHONE")) {
            return NextResponse.json(
                { message: "Valid type (EMAIL or PHONE) is required" },
                { status: 400 }
            );
        }

        // Generate OTP
        const otp = await createOTP(identifier, type);

        // Send OTP based on type
        if (type === "EMAIL") {
            const sent = await sendEmailOTP(identifier, otp);
            if (!sent) {
                return NextResponse.json(
                    { message: "Failed to send OTP email" },
                    { status: 500 }
                );
            }
        } else if (type === "PHONE") {
            const sent = await sendSmsOTP(identifier, otp);
            if (!sent) {
                return NextResponse.json(
                    { message: "Failed to send OTP SMS" },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({ message: "OTP sent successfully" });
    } catch (error) {
        console.error("Error sending OTP:", error);
        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to send OTP",
            },
            { status: 500 }
        );
    }
}
