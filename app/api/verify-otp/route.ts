import { NextRequest, NextResponse } from "next/server";
import { verifyOTP } from "@/lib/services/otp";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { identifier, type, otp } = body;

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

        if (!otp) {
            return NextResponse.json(
                { message: "OTP is required" },
                { status: 400 }
            );
        }

        // Verify OTP
        const isValid = await verifyOTP(identifier, type, otp);

        if (!isValid) {
            return NextResponse.json(
                { message: "Invalid or expired OTP" },
                { status: 400 }
            );
        }

        // If email verification, mark the user's email as verified
        if (type === "EMAIL") {
            //TODO: Mark the user's email as verified
        }

        // If phone verification, mark the user's phone as verified
        if (type === "PHONE") {
            //TODO: Mark the user's phone as verified
        }

        return NextResponse.json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return NextResponse.json(
            { message: "Failed to verify OTP" },
            { status: 500 }
        );
    }
}
