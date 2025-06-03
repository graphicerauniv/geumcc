import { serverEnv } from "../env/server";

const TEMPLATE_ID = "683d8408d6fc051c411ede52";

export const sendPhoneOTP = async (phone: string, otp: string) => {
    //Send OTP to phone number
    try {
        const res = await fetch("https://control.msg91.com/api/v5/flow", {
            method: "POST",
            headers: {
                accept: "application/json",
                authkey: serverEnv.MSG91_AUTH_KEY,
                "content-type": "application/json",
            },
            body: JSON.stringify({
                template_id: TEMPLATE_ID,
                short_url: "1",
                short_url_expiry: "3600",
                realTimeResponse: "1",
                recipients: [
                    {
                        mobiles: `91${phone}`,
                        OTP: otp,
                    },
                ],
            }),
        });

        if (!res.ok) {
            return false;
        }
        console.log("OTP sent successfully and otp is", otp);
    } catch (e) {
        return false;
    }
};
