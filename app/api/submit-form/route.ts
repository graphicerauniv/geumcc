import { NextRequest, NextResponse } from "next/server";
import { createFormSubmission } from "@/lib/services/form";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Here you would typically:
        // 1. Validate the data
        // 2. Save to database
        console.log("Form submission received:", body);
        const formSubmission = await createFormSubmission(body);

        // 3. //TODO:Send confirmation email

        // For now, we'll just return success
        return NextResponse.json({
            message: "Form submitted successfully",
            data: formSubmission,
        });
    } catch (error) {
        console.error("Error submitting form:", error);

        if (error instanceof Error) {
            if (
                error.message.includes(
                    "A submission with this phone number already exists"
                )
            ) {
                return NextResponse.json(
                    { message: error.message },
                    { status: 409 }
                );
            }

            if (error.message.includes("Invalid phone number")) {
                return NextResponse.json(
                    { message: error.message },
                    { status: 400 }
                );
            }
        }

        return NextResponse.json(
            {
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to submit form",
            },
            { status: 500 }
        );
    }
}
