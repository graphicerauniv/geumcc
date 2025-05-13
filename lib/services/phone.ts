import { serverEnv } from "../env/server";

export const sendPhoneOTP = async (phone: string, otp: string) => {
    //Send OTP to phone number
    try {
        const res = await fetch(
            `https://api.textlocal.in/send/?apikey=${serverEnv.TEXT_LOCAL_API_KEY}=&sender=GRAERA&numbers=${phone}&message=Your%20OTP%20is%20${otp}.%n-Graphic%20Era`
        );
        if (!res.ok) {
            return false;
        }
        console.log("OTP sent successfully and otp is", otp);
    } catch (e) {
        return false;
    }
};
