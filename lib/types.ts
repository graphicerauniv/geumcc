export interface OTP {
    identifier: string; // email or phone number
    type: "EMAIL" | "PHONE";
    code: string;
    expiresAt: Date;
    createdAt: Date;
}

export interface FormSubmission {
    _id: string;

    createdAt: Date;
    updatedAt: Date;

    name: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    domain: string;
    education: string;
    isRegistered: boolean;
}
