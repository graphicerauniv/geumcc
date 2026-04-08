import { FormSubmissionModel } from "@/lib/db/models";
import type { FormSubmission } from "@/lib/types";
import { dbConnect } from "@/lib/db/db";

/**
 * Create a new application
 * @param applicationData - Application data without ID, createdAt, or updatedAt
 * @returns The created application
 */
export async function createFormSubmission(
    formSubmissionData: Omit<FormSubmission, "_id" | "createdAt" | "updatedAt">
) {
    try {
        await dbConnect();

        const normalizedPhone = formSubmissionData.phone.replace(/\D/g, "");
        if (normalizedPhone.length !== 10) {
            throw new Error("Invalid phone number");
        }

        const existingSubmission = await FormSubmissionModel.findOne({
            phone: normalizedPhone,
        }).lean();

        if (existingSubmission) {
            throw new Error("A submission with this phone number already exists");
        }

        // Add timestamps
        const formSubmissionWithTimestamps = {
            ...formSubmissionData,
            phone: normalizedPhone,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        const formSubmission = await FormSubmissionModel.create(
            formSubmissionWithTimestamps
        );
        // Serialize MongoDB objects to plain JavaScript objects
        return JSON.parse(JSON.stringify(formSubmission));
    } catch (error) {
        console.error("MongoDB error:", error);
        if (error instanceof Error) {
            if (
                error.message.includes(
                    "A submission with this phone number already exists"
                ) ||
                error.message.includes("Invalid phone number")
            ) {
                throw error;
            }
        }
        throw new Error("Database error during form submission creation");
    }
}

/**
 * Get application by ID
 * @param applicationId - The ID of the application to retrieve
 * @returns The application or null if not found
 */
export async function getFormSubmissionById(formSubmissionId: string) {
    try {
        await dbConnect();

        const formSubmission = await FormSubmissionModel.findById(
            formSubmissionId
        ).lean();

        if (!formSubmission) {
            return null;
        }

        // Serialize MongoDB objects to plain JavaScript objects
        return JSON.parse(JSON.stringify(formSubmission));
    } catch (error) {
        console.error("MongoDB error:", error);
        throw new Error("Database error during form submission retrieval");
    }
}

/**
 * Get all form submissions
 * @returns List of submissions sorted by newest first
 */
export async function getAllFormSubmissions() {
    try {
        await dbConnect();

        const submissions = await FormSubmissionModel.find({})
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(submissions));
    } catch (error) {
        console.error("MongoDB error:", error);
        throw new Error("Database error during form submissions retrieval");
    }
}
