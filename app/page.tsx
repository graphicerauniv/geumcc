"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    emailOtp: z.string().min(6, "OTP must be 6 digits").optional(),
    phone: z.string().length(10, "Phone number must be 10 digits"),
    phoneOtp: z.string().min(6, "OTP must be 6 digits").optional(),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    domain: z.string().min(1, "Domain is required"),
    education: z.string().min(1, "Education level is required"),
    isRegistered: z.boolean(),
});

export default function Home() {
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            emailOtp: "",
            phone: "",
            phoneOtp: "",
            state: "",
            city: "",
            domain: "",
            education: "",
            isRegistered: false,
        },
    });

    const handleSendEmailOTP = async () => {
        try {
            const email = form.getValues("email");
            if (!email) {
                form.setError("email", {
                    message: "Please enter a valid email first",
                });
                return;
            }

            setSubmitting(true);
            // Call API route to send OTP
            const response = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: email, type: "EMAIL" }),
            });

            if (response.ok) {
                setEmailOtpSent(true);
            } else {
                const data = await response.json();
                form.setError("email", {
                    message: data.message || "Failed to send OTP",
                });
            }
        } catch (error) {
            console.error("Error sending email OTP:", error);
            form.setError("email", { message: "Failed to send OTP" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendPhoneOTP = async () => {
        try {
            const phone = form.getValues("phone");
            if (!phone) {
                form.setError("phone", {
                    message: "Please enter a valid phone number first",
                });
                return;
            }

            setSubmitting(true);
            // Call API route to send OTP
            const response = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: phone, type: "PHONE" }),
            });

            if (response.ok) {
                setPhoneOtpSent(true);
            } else {
                const data = await response.json();
                form.setError("phone", {
                    message: data.message || "Failed to send OTP",
                });
            }
        } catch (error) {
            console.error("Error sending phone OTP:", error);
            form.setError("phone", { message: "Failed to send OTP" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyEmailOTP = async () => {
        try {
            const email = form.getValues("email");
            const otp = form.getValues("emailOtp");

            if (!otp) {
                form.setError("emailOtp", { message: "Please enter the OTP" });
                return;
            }

            setSubmitting(true);
            // Call API route to verify OTP
            const response = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: email, type: "EMAIL", otp }),
            });

            if (response.ok) {
                setEmailVerified(true);
            } else {
                const data = await response.json();
                form.setError("emailOtp", {
                    message: data.message || "Invalid OTP",
                });
            }
        } catch (error) {
            console.error("Error verifying email OTP:", error);
            form.setError("emailOtp", { message: "Failed to verify OTP" });
        } finally {
            setSubmitting(false);
        }
    };

    const handleVerifyPhoneOTP = async () => {
        try {
            const phone = form.getValues("phone");
            const otp = form.getValues("phoneOtp");

            if (!otp) {
                form.setError("phoneOtp", { message: "Please enter the OTP" });
                return;
            }

            setSubmitting(true);
            // Call API route to verify OTP
            const response = await fetch("/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: phone, type: "PHONE", otp }),
            });

            if (response.ok) {
                setPhoneVerified(true);
            } else {
                const data = await response.json();
                form.setError("phoneOtp", {
                    message: data.message || "Invalid OTP",
                });
            }
        } catch (error) {
            console.error("Error verifying phone OTP:", error);
            form.setError("phoneOtp", { message: "Failed to verify OTP" });
        } finally {
            setSubmitting(false);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!emailVerified || !phoneVerified) {
            alert("Please verify both your email and phone number");
            return;
        }

        console.log(values);
        // Submit the form data to your backend
        try {
            const response = await fetch("/api/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                alert("Form submitted successfully!");
                form.reset();
                setEmailVerified(false);
                setPhoneVerified(false);
                setEmailOtpSent(false);
                setPhoneOtpSent(false);
            } else {
                const data = await response.json();
                alert(`Error: ${data.message || "Failed to submit form"}`);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("An error occurred while submitting the form");
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Welcome to Our Platform
                        </h1>
                        <p className="text-xl text-gray-600">
                            Join us today and take the first step towards your
                            future
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-6"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="John Doe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Email</FormLabel>
                                                    <div className="flex gap-2">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="john@example.com"
                                                                {...field}
                                                                disabled={
                                                                    emailVerified ||
                                                                    emailOtpSent
                                                                }
                                                            />
                                                        </FormControl>
                                                        {emailOtpSent &&
                                                        !emailVerified ? (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setEmailOtpSent(
                                                                        false
                                                                    );
                                                                    form.setValue(
                                                                        "emailOtp",
                                                                        ""
                                                                    );
                                                                    form.clearErrors(
                                                                        "email"
                                                                    );
                                                                    form.clearErrors(
                                                                        "emailOtp"
                                                                    );
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                variant={
                                                                    emailVerified
                                                                        ? "outline"
                                                                        : "secondary"
                                                                }
                                                                onClick={
                                                                    handleSendEmailOTP
                                                                }
                                                                disabled={
                                                                    emailVerified ||
                                                                    submitting ||
                                                                    !field.value
                                                                }
                                                            >
                                                                {emailVerified
                                                                    ? "Verified"
                                                                    : emailOtpSent
                                                                    ? "Resend"
                                                                    : "Send OTP"}
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {emailOtpSent && !emailVerified && (
                                            <FormField
                                                control={form.control}
                                                name="emailOtp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Email OTP
                                                        </FormLabel>
                                                        <div className="flex gap-2">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter OTP"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <Button
                                                                type="button"
                                                                onClick={
                                                                    handleVerifyEmailOTP
                                                                }
                                                                disabled={
                                                                    submitting
                                                                }
                                                            >
                                                                Verify
                                                            </Button>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <FormField
                                            control={form.control}
                                            name="phone"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Phone Number
                                                    </FormLabel>
                                                    <div className="flex gap-2">
                                                        <FormControl>
                                                            <Input
                                                                placeholder="98765 43210"
                                                                {...field}
                                                                disabled={
                                                                    phoneVerified ||
                                                                    phoneOtpSent
                                                                }
                                                            />
                                                        </FormControl>
                                                        {phoneOtpSent &&
                                                        !phoneVerified ? (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                onClick={() => {
                                                                    setPhoneOtpSent(
                                                                        false
                                                                    );
                                                                    form.setValue(
                                                                        "phoneOtp",
                                                                        ""
                                                                    );
                                                                    form.clearErrors(
                                                                        "phone"
                                                                    );
                                                                    form.clearErrors(
                                                                        "phoneOtp"
                                                                    );
                                                                }}
                                                            >
                                                                Edit
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                variant={
                                                                    phoneVerified
                                                                        ? "outline"
                                                                        : "secondary"
                                                                }
                                                                onClick={
                                                                    handleSendPhoneOTP
                                                                }
                                                                disabled={
                                                                    phoneVerified ||
                                                                    submitting ||
                                                                    !field.value
                                                                }
                                                            >
                                                                {phoneVerified
                                                                    ? "Verified"
                                                                    : phoneOtpSent
                                                                    ? "Resend"
                                                                    : "Send OTP"}
                                                            </Button>
                                                        )}
                                                    </div>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {phoneOtpSent && !phoneVerified && (
                                            <FormField
                                                control={form.control}
                                                name="phoneOtp"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Phone OTP
                                                        </FormLabel>
                                                        <div className="flex gap-2">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Enter OTP"
                                                                    {...field}
                                                                />
                                                            </FormControl>
                                                            <Button
                                                                type="button"
                                                                onClick={
                                                                    handleVerifyPhoneOTP
                                                                }
                                                                disabled={
                                                                    submitting
                                                                }
                                                            >
                                                                Verify
                                                            </Button>
                                                        </div>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="state"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>State</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your State"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="city"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>City</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Your City"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="domain"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Domain</FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a domain" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="computer-science">
                                                            Computer Science
                                                        </SelectItem>
                                                        <SelectItem value="information-technology">
                                                            Information
                                                            Technology
                                                        </SelectItem>
                                                        <SelectItem value="electronics">
                                                            Electronics
                                                        </SelectItem>
                                                        <SelectItem value="mechanical">
                                                            Mechanical
                                                        </SelectItem>
                                                        <SelectItem value="civil">
                                                            Civil
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="education"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Education Level
                                                </FormLabel>
                                                <Select
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    defaultValue={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select education level" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="ug">
                                                            Undergraduate (UG)
                                                        </SelectItem>
                                                        <SelectItem value="pg">
                                                            Postgraduate (PG)
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="isRegistered"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Are you already registered?
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={
                                        !emailVerified ||
                                        !phoneVerified ||
                                        submitting
                                    }
                                >
                                    Submit
                                </Button>
                            </form>
                        </Form>
                    </div>
                </div>
            </div>
        </main>
    );
}
