import type { FormValues, UTMParams, ERPData, ExtraQueryParams } from "./types";

declare global {
    interface Window {
        fbq: (event: string, action: string) => void;
        gtag: (
            event: string,
            action: string,
            data: Record<string, string>
        ) => void;
    }
}

export const getUTMParams = (): UTMParams => {
    const queryParams = new URLSearchParams(window.location.search);
    return {
        utm_source: queryParams.get("utm_source") || "",
        utm_campaign: queryParams.get("utm_campaign") || "",
        utm_medium: queryParams.get("utm_medium") || "",
        gclid: queryParams.get("gclid") || "",
        utm_content: queryParams.get("utm_content") || "",
        utm_term: queryParams.get("utm_term") || "",
        utm_device: queryParams.get("utm_device") || "",
        utm_keyword: queryParams.get("utm_keyword") || "",
        adpos: queryParams.get("adpos") || "",
        gadid: queryParams.get("gadid") || "",
        fbadid: queryParams.get("fbadid") || "",
    };
};

export const getExtraQueryParams = (): ExtraQueryParams => {
    const queryParams = new URLSearchParams(window.location.search);
    return {
        reff: queryParams.get("reff") || "",
    };
};

export const prepareERPData = (
    values: FormValues,
    utmParams: UTMParams
): ERPData => {
    return {
        ...values,
        AuthToken: "GEU-04-08-2020",
        Source: "geu",
        FirstName: values.name,
        MobileNumber: values.phone,
        LeadType: "Online",
        Course: "Counseling",
        Email: values.email,
        LeadSource: "MCC-LP",
        Field1: utmParams.utm_source,
        Field5: utmParams.utm_medium,
        Field6: utmParams.utm_campaign,
        TextB3: utmParams.gclid,
        TextB2: utmParams.utm_content,
        TextB1: utmParams.utm_term,
        Field9: utmParams.utm_device,
        Field10: utmParams.utm_keyword,
        Field11: utmParams.adpos,
        Center: "GEU-Dehradun",
        Location: values.domain,
        entity4: values.education,
        State: values.state,
        City: values.city,
        Remarks: `${values.state} - ${values.city} | ${values.domain} - ${values.education}`,
        Nationality: utmParams.gadid,
        PlaceOfBirth: utmParams.fbadid,
    };
};

export const trackFormSubmission = () => {
    window.fbq("track", "SubmitApplication");
    window.gtag("event", "GEU_Leads", {
        send_to: "AW-823971696/_vxmCMSb05QBEPCe84gD",
    });
    // await fetch("https://trk.clmbtrck.in/pixel?av=63204d84ed8de9547b2c53d6");
};
