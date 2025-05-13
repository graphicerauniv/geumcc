"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyPhoneOTP } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PhoneOtpFormProps {
    phone: string;
    email: string;
}

export default function PhoneOtpForm({ phone, email }: PhoneOtpFormProps) {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        // Add phone and email to formData
        formData.append("phone", phone);
        formData.append("email", email);

        try {
            const result = await verifyPhoneOTP(formData);

            if (result.success) {
                router.push("/dashboard");
                router.refresh();
            } else {
                setError(result.error || "Verification failed");
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
                    We've sent a verification code to{" "}
                    <span className="font-medium">{phone}</span>
                </p>
            </div>

            <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                    id="otp"
                    name="otp"
                    type="text"
                    autoComplete="one-time-code"
                    required
                    maxLength={6}
                    pattern="[0-9]{6}"
                    placeholder="Enter 6-digit code"
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Verifying..." : "Verify & Login"}
            </Button>
        </form>
    );
}
