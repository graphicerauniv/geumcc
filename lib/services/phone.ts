import { serverEnv } from "../env/server";

const TEMPLATE_ID = "683d8408d6fc051c411ede52";

type SendPhoneOtpResult = {
    success: boolean;
    message?: string;
};

export const sendPhoneOTP = async (
    phone: string,
    otp: string
): Promise<SendPhoneOtpResult> => {
    const authKey = serverEnv.MSG91_AUTH_KEY;
    const normalizedPhone = phone.replace(/\D/g, "");

    if (!authKey || authKey === "your_real_msg91_auth_key") {
        return {
            success: false,
            message: "MSG91 auth key is missing or invalid in .env.local",
        };
    }

    if (normalizedPhone.length !== 10) {
        return {
            success: false,
            message: "Phone number must be exactly 10 digits",
        };
    }

    try {
        const res = await fetch("https://control.msg91.com/api/v5/flow", {
            method: "POST",
            headers: {
                accept: "application/json",
                authkey: authKey,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                template_id: TEMPLATE_ID,
                short_url: "1",
                short_url_expiry: "3600",
                realTimeResponse: "1",
                recipients: [
                    {
                        mobiles: `91${normalizedPhone}`,
                        OTP: otp,
                    },
                ],
            }),
        });

        const raw = await res.text();
        let parsed: Record<string, unknown> | null = null;
        try {
            parsed = JSON.parse(raw) as Record<string, unknown>;
        } catch {
            parsed = null;
        }

        if (!res.ok) {
            const providerMessage =
                (parsed?.message as string) ||
                (parsed?.reason as string) ||
                raw ||
                `HTTP ${res.status}`;
            console.error("MSG91 OTP send failed:", providerMessage);
            return {
                success: false,
                message: `MSG91 rejected OTP request: ${providerMessage}`,
            };
        }

        if (
            typeof parsed?.type === "string" &&
            parsed.type.toLowerCase() === "error"
        ) {
            const providerMessage =
                (parsed?.message as string) || "Unknown MSG91 error";
            return {
                success: false,
                message: `MSG91 error: ${providerMessage}`,
            };
        }

        console.log("OTP sent successfully and otp is", otp);
        return { success: true };
    } catch (e) {
        console.error("Error sending phone OTP:", e);
        return {
            success: false,
            message:
                e instanceof Error ? e.message : "Unexpected OTP send error",
        };
    }
};
