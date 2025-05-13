import nodemailer from "nodemailer";
import { serverEnv } from "../env/server";

export const sendMailGeneric = async (
    email: string,
    replyTo: string,
    subject: string,
    html: string
) => {
    const smtpTransporter = nodemailer.createTransport({
        port: 465,
        host: "email-smtp.us-east-1.amazonaws.com",
        secure: true,
        auth: {
            user: serverEnv.SMTP_USERNAME,
            pass: serverEnv.SMTP_PASSWORD,
        },
        debug: true,
    });
    const mailOptions = {
        from: "no-reply@geu.ac.in",
        replyTo,
        to: email,
        subject,
        html,
    };
    smtpTransporter.sendMail(mailOptions);
};
