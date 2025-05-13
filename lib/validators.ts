import { z } from "zod";

// ===== Personal Info Form Validators =====
export const personalInfoSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    dob: z.string().refine((val) => {
        const date = new Date(val);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 15);
        return date <= eighteenYearsAgo;
    }, "You must be at least 15 years old"),
    gender: z.enum(["male", "female", "other"]),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    addressLine1: z.string().min(5, "Address must be at least 5 characters"),
    addressLine2: z.string().optional(),
    city: z.string().min(2, "City name must be at least 2 characters"),
    state: z.string().min(2, "State name must be at least 2 characters"),
    pincode: z.string().min(6, "Pincode must be at least 6 characters"),
});

export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;

// ===== Education Form Validators =====
export const educationSchema = z.object({
    // 10th
    tenthSchool: z.string().min(2, "School name must be at least 2 characters"),
    tenthBoard: z.string().min(2, "Board name must be at least 2 characters"),
    tenthPercentage: z.string().refine(
        (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0 && num <= 100;
        },
        { message: "Percentage must be a number between 0 and 100" }
    ),
    tenthYear: z.string().refine(
        (val) => {
            const year = parseInt(val);
            const currentYear = new Date().getFullYear();
            return !isNaN(year) && year >= 1950 && year <= currentYear;
        },
        { message: "Please enter a valid year" }
    ),
    tenthBranch: z.string().min(2, "Branch must be at least 2 characters"),

    // 12th
    twelfthSchool: z
        .string()
        .min(2, "School name must be at least 2 characters"),
    twelfthBoard: z.string().min(2, "Board name must be at least 2 characters"),
    twelfthPercentage: z.string().refine(
        (val) => {
            const num = parseFloat(val);
            return !isNaN(num) && num >= 0 && num <= 100;
        },
        { message: "Percentage must be a number between 0 and 100" }
    ),
    twelfthYear: z.string().refine(
        (val) => {
            const year = parseInt(val);
            const currentYear = new Date().getFullYear();
            return !isNaN(year) && year >= 1950 && year <= currentYear;
        },
        { message: "Please enter a valid year" }
    ),
    twelfthBranch: z.string().min(2, "Branch must be at least 2 characters"),

    // Diploma (Optional)
    diplomaSchool: z.string().optional(),
    diplomaPercentage: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                const num = parseFloat(val);
                return !isNaN(num) && num >= 0 && num <= 100;
            },
            { message: "Percentage must be a number between 0 and 100" }
        ),
    diplomaYear: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                const year = parseInt(val);
                const currentYear = new Date().getFullYear();
                return !isNaN(year) && year >= 1950 && year <= currentYear;
            },
            { message: "Please enter a valid year" }
        ),
    diplomaBranch: z.string().optional(),

    // Undergraduate (Optional)
    ugSchool: z.string().optional(),
    ugBoard: z.string().optional(),
    ugPercentage: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                const num = parseFloat(val);
                return !isNaN(num) && num >= 0 && num <= 100;
            },
            { message: "Percentage must be a number between 0 and 100" }
        ),
    ugYear: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                const year = parseInt(val);
                const currentYear = new Date().getFullYear();
                return !isNaN(year) && year >= 1950 && year <= currentYear;
            },
            { message: "Please enter a valid year" }
        ),
    ugBranch: z.string().optional(),

    // Postgraduate (Optional)
    pgSchool: z.string().optional(),
    pgBoard: z.string().optional(),
    pgPercentage: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                const num = parseFloat(val);
                return !isNaN(num) && num >= 0 && num <= 100;
            },
            { message: "Percentage must be a number between 0 and 100" }
        ),
    pgYear: z
        .string()
        .optional()
        .refine(
            (val) => {
                if (!val) return true;
                const year = parseInt(val);
                const currentYear = new Date().getFullYear();
                return !isNaN(year) && year >= 1950 && year <= currentYear;
            },
            { message: "Please enter a valid year" }
        ),
    pgBranch: z.string().optional(),

    // Work Experience
    workExperience: z.string().optional(),
});

export type EducationFormData = z.infer<typeof educationSchema>;

// ===== Document Upload Form Validators =====
export type DocumentType =
    | "photo"
    | "signature"
    | "idProof"
    | "academicFile"
    | "scoreCardFile"
    | "scoreCardOther";

export const documentUploadSchema = z.object({
    photo: z.string().min(1, "Passport size photo is required"),
    signature: z.string().min(1, "Signature is required"),
    idProof: z.string().optional(),
    academicFile: z.string().min(1, "Academic certificates are required"),
    scoreCardFile: z.string().optional(),
    scoreCardOther: z.string().optional(),
    gateScore: z.string().optional(),
    scoreCardValid: z.string().optional(),
});

export type DocumentUploadFormData = z.infer<typeof documentUploadSchema>;

// ===== Payment Form Validators =====
export const paymentSchema = z.object({
    transactionId: z
        .string()
        .min(5, "Transaction ID must be at least 5 characters"),
    dateOfTransaction: z.string().refine(
        (val) => {
            // Check if date is valid and not in the future
            const date = new Date(val);
            const today = new Date();
            today.setHours(23, 59, 59, 999); // End of today
            return !isNaN(date.getTime()) && date <= today;
        },
        { message: "Please enter a valid date not in the future" }
    ),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept the terms and conditions to proceed",
    }),
    additionalTermsAccepted: z.boolean().refine((val) => val === true, {
        message: "You must accept these terms to proceed",
    }),
});

export type PaymentFormData = z.infer<typeof paymentSchema>;

// ===== Helper Functions =====

/**
 * Helper function to validate percentage
 * @param val The percentage value as a string
 * @param isRequired Whether the value is required
 * @returns Boolean indicating if percentage is valid
 */
export const validatePercentage = (
    val: string | undefined,
    isRequired = true
): boolean => {
    if (!val && !isRequired) return true;
    if (!val && isRequired) return false;

    const num = parseFloat(val as string);
    return !isNaN(num) && num >= 0 && num <= 100;
};

/**
 * Helper function to validate year
 * @param val The year value as a string
 * @param isRequired Whether the value is required
 * @returns Boolean indicating if year is valid
 */
export const validateYear = (
    val: string | undefined,
    isRequired = true
): boolean => {
    if (!val && !isRequired) return true;
    if (!val && isRequired) return false;

    const year = parseInt(val as string);
    const currentYear = new Date().getFullYear();
    return !isNaN(year) && year >= 1950 && year <= currentYear;
};

/**
 * Helper function to validate date is not in future
 * @param val The date value as a string
 * @returns Boolean indicating if date is not in future
 */
export const validateDateNotInFuture = (val: string | undefined): boolean => {
    if (!val) return false;

    const date = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today
    return !isNaN(date.getTime()) && date <= today;
};

/**
 * Helper function to validate minimum age
 * @param val The date value as a string
 * @param minAge Minimum age required
 * @returns Boolean indicating if minimum age requirement is met
 */
export const validateMinimumAge = (
    val: string | undefined,
    minAge: number
): boolean => {
    if (!val) return false;

    const date = new Date(val);
    const minAgeDate = new Date();
    minAgeDate.setFullYear(minAgeDate.getFullYear() - minAge);
    return !isNaN(date.getTime()) && date <= minAgeDate;
};
