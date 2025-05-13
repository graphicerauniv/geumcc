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

        // Add timestamps
        const formSubmissionWithTimestamps = {
            ...formSubmissionData,
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
