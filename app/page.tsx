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
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/assets/geu-white.svg";

import { PLACES } from "@/data/static";

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

const DOMAINS = [
    { value: "computer-science", label: "Computer Science" },
    { value: "information-technology", label: "Information Technology" },
    { value: "electronics", label: "Electronics" },
    { value: "mechanical", label: "Mechanical" },
    { value: "civil", label: "Civil" },
];

const EDUCATION_LEVELS = [
    { value: "ug", label: "Undergraduate (UG)" },
    { value: "pg", label: "Postgraduate (PG)" },
];

// Stats for the hero section
const STATS = [
    {
        value: "₹58.5 Lacs",
        label: "Highest Package\nOffered",
    },
    {
        value: "Ranked 45",
        label: "Among Top Engineering\nColleges in India",
    },
];

export default function Home() {
    const [emailVerified, setEmailVerified] = useState(false);
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [emailOtpSent, setEmailOtpSent] = useState(false);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formError, setFormError] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            emailOtp: "",
            phone: "",
            phoneOtp: "",
            state: "Uttarakhand",
            city: "Dehradun",
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

        setSubmitting(true);
        try {
            // Submit the form data to your backend
            const response = await fetch("/api/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                setFormSubmitted(true);
                form.reset();
            } else {
                const data = await response.json();
                setFormError(true);
                console.error(
                    `Error: ${data.message || "Failed to submit form"}`
                );
            }
        } catch (error) {
            setFormError(true);
            console.error("Error submitting form:", error);
        } finally {
            setSubmitting(false);
        }
    }

    // Helper function for selecting cities based on state
    const getCitiesForState = (place: string) => {
        return PLACES.find((p) => p.state === place)?.cities || [];
    };

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 bg-[url('/bg.webp')] bg-cover bg-center bg-no-repeat">
            <div className="bg-black/40 min-h-screen">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            <Image src={logo} alt="Graphic Era University" />
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                        {/* Hero Content */}
                        <div className="text-white mb-12 md:mb-0">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif italic">
                                Admissions Open 2025
                            </h2>
                            <p className="text-sm mb-8">
                                Begin your career at the university with
                                consistently high placement records and
                                excellent academic standards.
                            </p>

                            {/* Stats */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                {STATS.map((stat, index) => (
                                    <div
                                        key={`stat-${index}`}
                                        className="rounded-lg bg-white/20 backdrop-blur-sm px-4 py-3"
                                    >
                                        <p className="text-xl font-bold">
                                            {stat.value}
                                        </p>
                                        <p className="text-sm whitespace-pre-line text-white/80">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Container */}
                        <div
                            className={cn(
                                "bg-white/50 backdrop-blur-lg rounded-3xl border-2 border-zinc-200 p-6 md:p-8 max-w-md mx-auto w-full",
                                {
                                    "bg-white/5 backdrop-blur-xl":
                                        formSubmitted || formError,
                                }
                            )}
                        >
                            {formSubmitted ? (
                                <div className="flex h-full min-h-[400px] items-center justify-center text-white">
                                    <div className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div className="text-lg">
                                            We've received your application. One
                                            of our counselors will contact you
                                            shortly!
                                        </div>
                                    </div>
                                </div>
                            ) : formError ? (
                                <div className="flex h-full min-h-[400px] items-center justify-center text-red-700">
                                    <div className="flex items-start gap-2">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-12 w-12"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <div className="text-lg">
                                            An error occurred. Please try again
                                            after refreshing the page!
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-2xl font-semibold text-white border-b border-white/20 pb-4 mb-4">
                                            Apply Now
                                        </h3>

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-zinc-800">
                                                        Full Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your Name"
                                                            {...field}
                                                            className="bg-white border-zinc-300"
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
                                                        <FormLabel className="text-zinc-800">
                                                            Email
                                                        </FormLabel>
                                                        <div className="flex gap-2">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="your.email@example.com"
                                                                    {...field}
                                                                    className="bg-white border-zinc-300"
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
                                                            <FormLabel className="text-zinc-800">
                                                                Email OTP
                                                            </FormLabel>
                                                            <div className="flex gap-2">
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter OTP"
                                                                        {...field}
                                                                        className="bg-white border-zinc-300"
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
                                                        <FormLabel className="text-zinc-800">
                                                            Phone Number
                                                        </FormLabel>
                                                        <div className="flex gap-2">
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="9876543210"
                                                                    {...field}
                                                                    className="bg-white border-zinc-300"
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
                                                            <FormLabel className="text-zinc-800">
                                                                Phone OTP
                                                            </FormLabel>
                                                            <div className="flex gap-2">
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter OTP"
                                                                        {...field}
                                                                        className="bg-white border-zinc-300"
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

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-800">
                                                            State
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(
                                                                value
                                                            ) => {
                                                                field.onChange(
                                                                    value
                                                                );
                                                                form.setValue(
                                                                    "city",
                                                                    getCitiesForState(
                                                                        value
                                                                    )[0] || ""
                                                                );
                                                            }}
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white border-zinc-300">
                                                                    <SelectValue placeholder="Select a state" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {PLACES.map(
                                                                    (place) => (
                                                                        <SelectItem
                                                                            key={
                                                                                place.state
                                                                            }
                                                                            value={
                                                                                place.state
                                                                            }
                                                                        >
                                                                            {
                                                                                place.state
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-800">
                                                            City
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white border-zinc-300">
                                                                    <SelectValue placeholder="Select a city" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {getCitiesForState(
                                                                    form.getValues(
                                                                        "state"
                                                                    )
                                                                ).map(
                                                                    (city) => (
                                                                        <SelectItem
                                                                            key={
                                                                                city
                                                                            }
                                                                            value={
                                                                                city
                                                                            }
                                                                        >
                                                                            {
                                                                                city
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="domain"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-zinc-800">
                                                            Domain
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white border-zinc-300">
                                                                    <SelectValue placeholder="Select a domain" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {DOMAINS.map(
                                                                    (
                                                                        domain
                                                                    ) => (
                                                                        <SelectItem
                                                                            key={
                                                                                domain.value
                                                                            }
                                                                            value={
                                                                                domain.value
                                                                            }
                                                                        >
                                                                            {
                                                                                domain.label
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
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
                                                        <FormLabel className="text-zinc-800">
                                                            Education Level
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white border-zinc-300">
                                                                    <SelectValue placeholder="Select education level" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {EDUCATION_LEVELS.map(
                                                                    (level) => (
                                                                        <SelectItem
                                                                            key={
                                                                                level.value
                                                                            }
                                                                            value={
                                                                                level.value
                                                                            }
                                                                        >
                                                                            {
                                                                                level.label
                                                                            }
                                                                        </SelectItem>
                                                                    )
                                                                )}
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
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-zinc-800">
                                                            Are you already
                                                            registered?
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <p className="text-xs text-zinc-600">
                                            I authorize Graphic Era University
                                            to contact me with promotional and
                                            transactional updates via Email,
                                            SMS, WhatsApp and Call. This will
                                            override registry on DND/NDNC.
                                        </p>

                                        <div className="flex w-full flex-col items-center justify-center gap-2">
                                            <Button
                                                type="submit"
                                                className={cn(
                                                    "rounded-lg border-2 border-two-light bg-two px-5 py-2 font-medium text-white transition-all outline-none hover:bg-two-dark hover:text-white",
                                                    {
                                                        "cursor-wait text-zinc-400 hover:border-zinc-300 hover:bg-zinc-200 hover:text-zinc-400":
                                                            submitting,
                                                    }
                                                )}
                                                disabled={
                                                    !emailVerified ||
                                                    !phoneVerified ||
                                                    submitting
                                                }
                                            >
                                                {submitting && (
                                                    <div
                                                        className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                        aria-hidden="true"
                                                    >
                                                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !border-0 !p-0 !whitespace-nowrap ![clip:rect(0,0,0,0)]">
                                                            Loading...
                                                        </span>
                                                    </div>
                                                )}
                                                {submitting
                                                    ? "Applying..."
                                                    : "Apply"}
                                            </Button>
                                        </div>
                                    </form>
                                </Form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
