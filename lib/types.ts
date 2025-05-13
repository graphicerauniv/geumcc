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

// FOR HERO PAGE

export interface FormValues {
    name: string;
    email: string;
    phone: string;
    state: string;
    city: string;
    domain: string;
    education: string;
    isRegistered: boolean;
}

export interface UTMParams {
    utm_source: string;
    utm_campaign: string;
    utm_medium: string;
    gclid: string;
    utm_content: string;
    utm_term: string;
    utm_device: string;
    utm_keyword: string;
    adpos: string;
    gadid: string;
    fbadid: string;
}

export interface MessageSentState {
    success: boolean;
    error: boolean;
}

export interface ERPData extends FormValues {
    AuthToken: string;
    Source: string;
    FirstName: string;
    MobileNumber: string;
    LeadType: string;
    Course: string;
    Email: string;
    LeadSource: string;
    Field1: string;
    Field5: string;
    Field6: string;
    TextB3: string;
    TextB2: string;
    TextB1: string;
    Field9: string;
    Field10: string;
    Field11: string;
    Center: string;
    Location: string;
    entity4: string;
    State: string;
    City: string;
    Remarks: string;
    Nationality: string;
    PlaceOfBirth: string;
    // Experience: string;
}
