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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import logo from "@/assets/geu-white.webp";

import { PLACES } from "@/data/static";
import { COURSE_OPTIONS, DEPARTMENTS } from "@/data/course-options";

import { Calendar, Clock, MapPin } from "lucide-react";
import {
    getExtraQueryParams,
} from "@/lib/form";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().length(10, "Phone number must be 10 digits"),
    phoneOtp: z.string().min(6, "OTP must be 6 digits").optional(),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    domain: z.string().min(1, "Department is required"),
    education: z.string().min(1, "Course is required"),
    isRegistered: z.boolean(),
});

// Stats for the hero section
const STATS = [
    {
        value: "20+ Experts",
        label: "Top Education\nExperts",
    },
    {
        value: "1000+ Seats",
        label: "Limited Availability\nRegister Now",
    },
];

const FormMessageStyled = ({ children }: { children: React.ReactNode }) => {
    return <p className="text-red-300 text-sm mt-1 font-medium">{children}</p>;
};

export default function Home() {
    const [phoneVerified, setPhoneVerified] = useState(false);
    const [phoneOtpSent, setPhoneOtpSent] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formError, setFormError] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            phoneOtp: "",
            state: "",
            city: "",
            domain: "",
            education: "",
            isRegistered: false,
        },
    });
    const selectedState = form.watch("state");
    const selectedDepartment = form.watch("domain");
    const selectedDepartmentCourses = selectedDepartment
        ? COURSE_OPTIONS[selectedDepartment] || []
        : [];

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
            const response = await fetch("/mcc/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: phone, type: "PHONE" }),
            });

            if (response.ok) {
                setPhoneOtpSent(true);
            } else {
                const raw = await response.text();
                let data: { message?: string } = {};
                try {
                    data = JSON.parse(raw);
                } catch {
                    data = {};
                }
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
            const response = await fetch("/mcc/api/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier: phone, type: "PHONE", otp }),
            });

            if (response.ok) {
                setPhoneVerified(true);
            } else {
                const raw = await response.text();
                let data: { message?: string } = {};
                try {
                    data = JSON.parse(raw);
                } catch {
                    data = {};
                }
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
        if (!phoneVerified) {
            alert("Please verify your phone number");
            return;
        }

        setSubmitting(true);

        const extraQueryParams = getExtraQueryParams();

        try {
            // Save only to your Mongo-backed API
            const response = await fetch("/mcc/api/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, ...extraQueryParams }),
            });

            if (response.ok) {
                setFormSubmitted(true);
                form.reset();
            } else {
                const raw = await response.text();
                let data: { message?: string } = {};
                try {
                    data = JSON.parse(raw);
                } catch {
                    data = {};
                }
                const message = data.message || "Failed to submit form";
                if (response.status === 409) {
                    form.setError("phone", { message });
                } else {
                    setFormError(true);
                }
                console.error(
                    `Error: ${message}`
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
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 bg-[url('/mcc/bg.webp')] bg-cover bg-center bg-no-repeat">

            <div className="bg-black/60 min-h-screen">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            <Image
  src={logo}
  alt="Graphic Era University"
  width={150}
  height={60}
/>
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                        {/* Hero Content */}
                        <div className="text-white mb-12 md:mb-0">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
                                Mega Career Counselling
                            </h2>
                            <p className="text-xl mb-4">
                                Engage with visionaries and academic leaders who understand what it takes to succeed today. Get real insights, practical direction, and answers that actually matter to your future. Take a pivotal next step in your journey!
                            </p>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3">
                                    What You Can Expect:
                                </h3>
                                <ol className="space-y-2 list-none pl-0 counter-reset-item">
  <li className="flex before:content-['1)'] before:counter-increment-[item] before:mr-2">
    1:1 career guidance tailored to your interests
  </li>
  <li className="flex before:content-['2)'] before:counter-increment-[item] before:mr-2">
    Focused sessions on emerging growth domains
  </li>
  <li className="flex before:content-['3)'] before:counter-increment-[item] before:mr-2">
    Hands-on exposure to emerging fields like Generative AI
  </li>
  <li className="flex before:content-['4)'] before:counter-increment-[item] before:mr-2">
    Real world insights from Industry and Academic leaders
  </li>
</ol>
                            </div>

                            {/* Event details */}
                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-400" />
                                    <span>
                                        17-Apr-2026 (Friday)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-400" />
                                    <span> Reporting Time: 09:00 AM </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-400" />
                                    <span> Venue:Silver Jubilee Content Center<br></br>
                                        Graphic Era (Deemed to be University) </span>
                                </div>
                            </div>

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
                                "bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 p-6 md:p-8 max-w-md ml-auto w-full shadow-xl",
                                {
                                    "bg-white/40 backdrop-blur-xl":
                                        formSubmitted || formError,
                                }
                            )}
                        >
                            {formSubmitted ? (
                                <div className="flex h-full min-h-[400px] items-center justify-center text-white">
                                    <div className="flex flex-col items-center text-center p-6">
                                        <div className="text-xl font-semibold tracking-wide">
                                            Thank you For your registration!
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
                                            or contact us directly!
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Form {...form}>
                                    <form
                                        onSubmit={form.handleSubmit(onSubmit)}
                                        className="space-y-4"
                                    >
                                        <h3 className="text-2xl font-semibold text-white border-b border-white/30 pb-4 mb-4">
                                            Register for the Event
                                        </h3>

                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-white font-medium">
                                                        Full Name
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Your Name"
                                                            {...field}
                                                            className="bg-white/90 border-zinc-300 w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessageStyled>{form.formState.errors.name?.message}</FormMessageStyled>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="email"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormLabel className="text-white font-medium">
                                                        Email
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="your.email@example.com"
                                                            {...field}
                                                            className="bg-white/90 border-zinc-300 w-full"
                                                        />
                                                    </FormControl>
                                                    <FormMessageStyled>{form.formState.errors.email?.message}</FormMessageStyled>
                                                </FormItem>
                                            )}
                                        />

                                        <div className="space-y-2 w-full">
                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-white font-medium">
                                                            Phone Number
                                                        </FormLabel>
                                                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                                                            <FormControl className="w-full sm:flex-1">
                                                                <Input
                                                                    placeholder="9876543210"
                                                                    {...field}
                                                                    className="bg-white/90 border-zinc-300"
                                                                    disabled={phoneVerified || phoneOtpSent}
                                                                />
                                                            </FormControl>
                                                            {phoneOtpSent && !phoneVerified ? (
                                                                <Button
                                                                    type="button"
                                                                    variant="outline"
                                                                    onClick={() => {
                                                                        setPhoneOtpSent(false);
                                                                        form.setValue("phoneOtp", "");
                                                                        form.clearErrors("phone");
                                                                        form.clearErrors("phoneOtp");
                                                                    }}
                                                                >
                                                                    Edit
                                                                </Button>
                                                            ) : (
                                                                <Button
                                                                    type="button"
                                                                    variant={phoneVerified ? "outline" : "secondary"}
                                                                    onClick={handleSendPhoneOTP}
                                                                    disabled={phoneVerified || submitting || !field.value}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white border-white/20"
                                                                >
                                                                    {phoneVerified ? "Verified" : phoneOtpSent ? "Resend" : "Send OTP"}
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <FormMessageStyled>{form.formState.errors.phone?.message}</FormMessageStyled>
                                                    </FormItem>
                                                )}
                                            />

                                            {phoneOtpSent && !phoneVerified && (
                                                <FormField
                                                    control={form.control}
                                                    name="phoneOtp"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-white font-medium">
                                                                Phone OTP
                                                            </FormLabel>
                                                            <div className="flex gap-2">
                                                                <FormControl>
                                                                    <Input
                                                                        placeholder="Enter OTP"
                                                                        {...field}
                                                                        className="bg-white/90 border-zinc-300"
                                                                    />
                                                                </FormControl>
                                                                <Button
                                                                    type="button"
                                                                    onClick={handleVerifyPhoneOTP}
                                                                    disabled={submitting}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                >
                                                                    Verify
                                                                </Button>
                                                            </div>
                                                            <FormMessageStyled>{form.formState.errors.phoneOtp?.message}</FormMessageStyled>
                                                        </FormItem>
                                                    )}
                                                />
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="state"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-white font-medium">
                                                            State
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                form.setValue("city", "");
                                                                form.clearErrors("city");
                                                            }}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/90 border-zinc-300 w-full">
                                                                    <SelectValue placeholder="Select a state" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {PLACES.map((place) => (
                                                                    <SelectItem key={place.state} value={place.state}>
                                                                        {place.state}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessageStyled>{form.formState.errors.state?.message}</FormMessageStyled>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="city"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-white font-medium">
                                                            City
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            disabled={!selectedState}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/90 border-zinc-300 w-full" disabled={!selectedState}>
                                                                    <SelectValue placeholder="Select a city" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {getCitiesForState(selectedState).map((city) => (
                                                                    <SelectItem key={city} value={city}>
                                                                        {city}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessageStyled>{form.formState.errors.city?.message}</FormMessageStyled>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="domain"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-white font-medium">
                                                            Department
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={(value) => {
                                                                field.onChange(value);
                                                                form.setValue("education", "");
                                                                form.clearErrors("education");
                                                            }}
                                                            value={field.value}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/90 border-zinc-300 w-full">
                                                                    <SelectValue placeholder="Select a department" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {DEPARTMENTS.map((department) => (
                                                                    <SelectItem key={department} value={department}>
                                                                        {department}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessageStyled>{form.formState.errors.domain?.message}</FormMessageStyled>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="education"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-white font-medium">
                                                            Course
                                                        </FormLabel>
                                                        <Select
                                                            onValueChange={field.onChange}
                                                            value={field.value}
                                                            disabled={!selectedDepartment}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/90 border-zinc-300 w-full" disabled={!selectedDepartment}>
                                                                    <SelectValue
                                                                        placeholder={
                                                                            selectedDepartment
                                                                                ? "Select a course"
                                                                                : "Select department first"
                                                                        }
                                                                    />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {selectedDepartmentCourses.map((course) => (
                                                                    <SelectItem key={course} value={course}>
                                                                        {course}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessageStyled>{form.formState.errors.education?.message}</FormMessageStyled>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                  

                                        <p className="text-xs text-white/80">
                                            I authorize Graphic Era University to contact me with promotional and transactional updates via Email, SMS, WhatsApp and Call. This will override registry on DND/NDNC.
                                        </p>

                                        <Button
                                            type="submit"
                                            className={cn(
                                                "w-full rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-all hover:bg-blue-700",
                                                {
                                                    "cursor-wait opacity-70 hover:bg-blue-600": submitting,
                                                }
                                            )}
                                            disabled={!phoneVerified || submitting}
                                        >
                                            {submitting ? "Applying..." : "Apply"}
                                        </Button>
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
