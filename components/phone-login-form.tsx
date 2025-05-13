"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginWithPhone } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function PhoneLoginForm() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setError(null);

        try {
            const result = await loginWithPhone(formData);

            if (result.success) {
                if (result.action === "verify_phone_otp") {
                    // Redirect to phone OTP verification with necessary data
                    router.push(
                        `/verify-phone?phone=${result.phone}&email=${result.email}`
                    );
                } else if (result.action === "verify_both_otp") {
                    // Redirect to both OTP verification with necessary data
                    router.push(
                        `/verify-both?phone=${result.phone}&email=${result.email}`
                    );
                }
            } else {
                if (result.action === "signup") {
                    // Phone not found, offer to sign up
                    router.push(`/signup?phone=${formData.get("phone")}`);
                } else {
                    setError(result.error || "Failed to login");
                }
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

            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    placeholder="9876543210"
                />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Continue with Phone"}
            </Button>
        </form>
    );
}
