"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyBothOTP } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface BothOtpFormProps {
    phone: string;
    email: string;
}

export default function BothOtpForm({ phone, email }: BothOtpFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [phoneValid, setPhoneValid] = useState<boolean | null>(null);
    const [emailValid, setEmailValid] = useState<boolean | null>(null);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);
        setPhoneValid(null);
        setEmailValid(null);

        // Add phone and email to formData
        formData.append("phone", phone);
        formData.append("email", email);

        try {
            const result = await verifyBothOTP(formData);

            if (result.success) {
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(result.error || "Verification failed");
                if (result.phoneValid !== undefined)
                    setPhoneValid(result.phoneValid);
                if (result.emailValid !== undefined)
                    setEmailValid(result.emailValid);
            }
        } catch (err) {
            setError("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                    We've sent verification codes to your phone and email
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    <span className="font-medium">{phone}</span> and{" "}
                    <span className="font-medium">{email}</span>
                </p>
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="phoneOtp"
                    className={phoneValid === false ? "text-red-500" : ""}
                >
                    Phone Verification Code
                </Label>
                <Input
                    id="phoneOtp"
                    name="phoneOtp"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="Enter 6-digit code"
                    className={phoneValid === false ? "border-red-500" : ""}
                />
                {phoneValid === false && (
                    <p className="text-xs text-red-500">
                        Invalid phone verification code
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <Label
                    htmlFor="emailOtp"
                    className={emailValid === false ? "text-red-500" : ""}
                >
                    Email Verification Code
                </Label>
                <Input
                    id="emailOtp"
                    name="emailOtp"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="Enter 6-digit code"
                    className={emailValid === false ? "border-red-500" : ""}
                />
                {emailValid === false && (
                    <p className="text-xs text-red-500">
                        Invalid email verification code
                    </p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & Complete"}
            </Button>
        </form>
    );
}
