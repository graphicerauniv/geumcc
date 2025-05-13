import { FormSubmissionModel, OTPModel } from "@/lib/db/models";
import { dbConnect } from "@/lib/db/db";
import { sendMailGeneric } from "./mailing";
import { sendPhoneOTP } from "./phone";

// Generate a random 6-digit OTP
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create OTP for phone or email verification
export async function createOTP(
    identifier: string,
    type: "EMAIL" | "PHONE"
): Promise<string> {
    try {
        await dbConnect();

        // Generate a new OTP
        const code = generateOTP();

        // OTP expires in 10 minutes
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        // Remove any existing OTPs for this identifier and type
        await OTPModel.deleteMany({ identifier, type });

        // Create a new OTP
        await OTPModel.create({
            identifier,
            type,
            code,
            expiresAt,
            createdAt: new Date(),
        });

        return code;
    } catch (error) {
        console.error("Error creating OTP:", error);
        throw new Error("Could not create OTP");
    }
}

// Verify OTP against stored OTP
export async function verifyOTP(
    identifier: string,
    type: "EMAIL" | "PHONE",
    otpToVerify: string
): Promise<boolean> {
    try {
        await dbConnect();

        // Find the OTP for this identifier and type
        const otp = await OTPModel.findOne({
            identifier,
            type,
            code: otpToVerify,
        });

        if (!otp) {
            return false;
        }

        // Check if OTP has expired
        if (new Date() > otp.expiresAt) {
            // Clean up expired OTP - use _id directly as MongoDB can handle it
            await OTPModel.deleteOne({ _id: otp._id });
            return false;
        }

        // Delete the used OTP - use _id directly as MongoDB can handle it
        await OTPModel.deleteOne({ _id: otp._id });

        return true;
    } catch (error) {
        console.error("Error verifying OTP:", error);
        throw new Error("Could not verify OTP");
    }
}

// Mock functions to send OTP via email and SMS
// In a real application, these would use actual email and SMS services
export async function sendEmailOTP(
    email: string,
    otp: string
): Promise<boolean> {
    // In a real application, this would use an email service like SendGrid or Nodemailer
    console.log(`Sending OTP ${otp} to email: ${email}`);

    //Send OTP to email
    await sendMailGeneric(
        email,
        "no-reply@geu.ac.in",
        "Your One-Time Password for Graphic Era Mega Counselling Session",
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="color: #003366;">Graphic Era Mega Counselling Session</h2>
            </div>
            <p>Dear Applicant,</p>
            <p>Your One-Time Password (OTP) for the Graphic Era Mega Counselling Session is:</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">${otp}</div>
            <p>This OTP is valid for 10 minutes. Please do not share this OTP with anyone for security reasons.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Thank you,<br>GECET Team<br>Graphic Era University</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666;">
                <p>This is an automated email. Please do not reply to this message.</p>
            </div>
        </div>`
    );
    return true;
}

export async function sendSmsOTP(phone: string, otp: string): Promise<boolean> {
    console.log(`Sending OTP ${otp} to phone: ${phone}`);

    //Send OTP to phone number
    await sendPhoneOTP(phone, otp);
    return true;
}
