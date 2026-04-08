import { NextRequest, NextResponse } from "next/server";
import { getAllFormSubmissions } from "@/lib/services/form";
import {
    DATATEST_AUTH_COOKIE,
    isDatatestSessionValid,
} from "@/lib/services/datatest-auth";

function escapeCsv(value: unknown): string {
    if (value === null || value === undefined) return "";
    const str = String(value).replace(/"/g, '""');
    return `"${str}"`;
}

export async function GET(request: NextRequest) {
    try {
        const cookieValue = request.cookies.get(DATATEST_AUTH_COOKIE)?.value;
        if (!isDatatestSessionValid(cookieValue)) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const submissions = await getAllFormSubmissions();
        const headers = [
            "Name",
            "Email",
            "Phone",
            "State",
            "City",
            "Domain",
            "Education",
            "Is Registered",
            "Reference",
            "Created At",
        ];

        const rows = submissions.map((item: Record<string, unknown>) => [
            escapeCsv(item.name),
            escapeCsv(item.email),
            escapeCsv(item.phone),
            escapeCsv(item.state),
            escapeCsv(item.city),
            escapeCsv(item.domain),
            escapeCsv(item.education),
            escapeCsv(item.isRegistered ? "Yes" : "No"),
            escapeCsv(item.reff || ""),
            escapeCsv(item.createdAt),
        ]);

        const csv = [headers.map(escapeCsv).join(","), ...rows.map((r) => r.join(","))].join(
            "\n"
        );

        return new NextResponse(csv, {
            status: 200,
            headers: {
                "Content-Type": "text/csv; charset=utf-8",
                "Content-Disposition":
                    'attachment; filename="mcc-form-submissions.csv"',
                "Cache-Control": "no-store",
            },
        });
    } catch (error) {
        console.error("Datatest download error:", error);
        return NextResponse.json(
            { message: "Failed to download data" },
            { status: 500 }
        );
    }
}

