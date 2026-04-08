import mongoose, { Schema, Document, Model } from "mongoose";
import type { FormSubmission, OTP } from "@/lib/types";

// Application Model
interface IFormSubmissionDocument
    extends Omit<FormSubmission, "_id">,
        Document {}

const FormSubmissionSchema = new Schema<IFormSubmissionDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    domain: { type: String, required: true },
    education: { type: String, required: true },
    isRegistered: { type: Boolean, required: true },
    reff: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

const FormSubmissionModel: Model<IFormSubmissionDocument> =
    mongoose.models.FormSubmission ||
    mongoose.model<IFormSubmissionDocument>(
        "FormSubmission",
        FormSubmissionSchema
    );

// OTP Model
interface IOTPDocument extends Omit<OTP, "_id">, Document {}

const OTPSchema = new Schema<IOTPDocument>({
    identifier: { type: String, required: true, index: true },
    type: { type: String, required: true, enum: ["EMAIL", "PHONE"] },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
});

const OTPModel: Model<IOTPDocument> =
    mongoose.models.OTP || mongoose.model<IOTPDocument>("OTP", OTPSchema);

// Export interfaces for use in other files
export type { IFormSubmissionDocument, IOTPDocument };

// Export the models
export { FormSubmissionModel, OTPModel };
