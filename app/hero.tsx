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
import logo from "@/assets/gehu-white.svg";

import { PLACES } from "@/data/static";

import { Calendar, Clock, MapPin } from "lucide-react";
import {
    getExtraQueryParams,
    getUTMParams,
    prepareERPData,
    trackFormSubmission,
} from "@/lib/form";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
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
    { value: "aerospace-engineering", label: "Aerospace Engineering" },
    {
        value: "electronics-and-communication",
        label: "Electronics and Communication",
    },
    { value: "mechanical-engineering", label: "Mechanical Engineering" },
    { value: "civil-engineering", label: "Civil Engineering" },
    { value: "biotechnology", label: "Biotechnology" },
    { value: "management", label: "Management" },
    { value: "commerce", label: "Commerce" },
    { value: "law", label: "Law" },
    { value: "design", label: "Design" },
    { value: "media-and-mass-com", label: "Media and Mass Com" },
    { value: "fashion-design", label: "Fashion Design" },
    {
        value: "humanities-and-social-sciences",
        label: "Humanities and Social Sciences",
    },
    { value: "paramedical-sciences", label: "Paramedical Sciences" },
    { value: "life-sciences", label: "Life Sciences" },
];

const EDUCATION_LEVELS = [
    { value: "ug", label: "Undergraduate (UG)" },
    { value: "pg", label: "Postgraduate (PG)" },
];

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
            state: "Uttarakhand",
            city: "Haldwani",
            domain: "",
            education: "",
            isRegistered: false,
        },
    });

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
        if (!phoneVerified) {
            alert("Please verify your phone number");
            return;
        }

        setSubmitting(true);

        const utmParams = getUTMParams();
        const extraQueryParams = getExtraQueryParams();

        const today = new Date();
        const registrationDateAndTime = today.toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            hour12: true,
            day: "2-digit",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
        const phoneWithDateAndTime = `${String(
            values.phone
        )}#${today.toISOString()}`;

        // ------------ Tracking Data ---------------------------------------------------
        trackFormSubmission();

        try {
            // ------------ AWS API -------------------------------------------------------
            const awsApiData = {
                ...utmParams,
                name: values.name,
                email: values.email,
                phone: phoneWithDateAndTime,
                campaign_source: `MCC-HALDWANI-LP`,
                domain: values.domain,
                education: values.education,
                state: values.state,
                city: values.city,
                RegistrationTime: registrationDateAndTime,
                ...extraQueryParams,
            };

            // ------------ CMS API -------------------------------------------------------
            const erpData = prepareERPData(values, utmParams);

            // ------------ Addition API ---------------------------------------------------
            const additionalApiData = new URLSearchParams({
                apikey: "4b4edae164jfghfyhtfytdgty",
                campus_code: "geu",
                from_name: values.name,
                from_email: values.email,
                phone_number: values.phone,
                state: values.state,
                city: values.city,
                department: values.domain,
                course: values.education,
                ...utmParams,
                ...extraQueryParams,
            }).toString();

            // Execute all API calls in parallel
            await Promise.all([
                fetch(
                    "https://olwhyb4daf.execute-api.ap-south-1.amazonaws.com/v1/put-data",
                    {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(awsApiData),
                    }
                ),
                fetch(
                    "https://publisher.extraaedge.com/api/Webhook/addPublisherLead",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(erpData),
                    }
                ),
                fetch(
                    `https://apply.geu.ac.in/univer/public/api/store-json?${additionalApiData}`,
                    {
                        method: "POST",
                        redirect: "follow",
                    }
                ),
            ]);

            // ------------ Main DB --------------------------------------------------------
            const response = await fetch("/mcc/api/submit-form", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, ...extraQueryParams }),
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
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 bg-[url('/mcc/bg.webp')] bg-cover bg-center bg-no-repeat">
            <div className="bg-black/60 min-h-screen">
                <div className="container mx-auto px-4 py-12">
                    <div className="flex justify-center mb-8">
                        <h1 className="text-3xl font-bold text-white">
                            <Image src={logo} alt="Graphic Era University" />
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-6xl mx-auto">
                        {/* Hero Content */}
                        <div className="text-white mb-12 md:mb-0">
                            <h2 className="text-4xl md:text-5xl font-bold mb-4 font-serif">
                                Mega Career Counselling
                            </h2>
                            <p className="text-xl mb-4">
                                Get guided by the education experts of India
                            </p>
                            <p className="text mb-8">
                                Hosted by some of India&apos;s leading education
                                experts — don&apos;t miss this opportunity to
                                plan your future with clarity and confidence.
                            </p>

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold mb-3">
                                    Event Highlights:
                                </h3>
                                <ul className="space-y-2">
                                    <li className="flex items-start">
                                        <span className="text-blue-400 mr-2">
                                            •
                                        </span>
                                        <span>
                                            Get expert guidance on shaping your
                                            career in the AI generation.
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-400 mr-2">
                                            •
                                        </span>
                                        <span>
                                            Tailored sessions across all major
                                            domains
                                        </span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-blue-400 mr-2">
                                            •
                                        </span>
                                        <span>
                                            Personal Interviews & Spot
                                            Admissions
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            {/* Event details */}
                            <div className="flex flex-col gap-4 mb-8">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-400" />
                                    <span>
                                        May 31 & June 01, 2025 (Saturday &
                                        Sunday)
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-blue-400" />
                                    <span> Reporting Time: 10:00 AM </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-5 w-5 text-blue-400" />
                                    <span>GEHU Haldwani Campus</span>
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
                                // <div className="flex h-full min-h-[400px] items-center justify-center text-white">
                                //     <div className="flex flex-col items-center text-center p-6">
                                //         <div className="mb-4">
                                //             <svg
                                //                 xmlns="http://www.w3.org/2000/svg"
                                //                 className="h-16 w-16 text-amber-400"
                                //                 fill="none"
                                //                 viewBox="0 0 24 24"
                                //                 stroke="currentColor"
                                //             >
                                //                 <path
                                //                     strokeLinecap="round"
                                //                     strokeLinejoin="round"
                                //                     strokeWidth={2}
                                //                     d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                //                 />
                                //             </svg>
                                //         </div>
                                //         <div className="text-xl font-semibold tracking-wide">
                                //             Online registration closed
                                //         </div>
                                //         <div className="mt-2 text-white/90">
                                //             On-the-spot registration available.
                                //             <br />
                                //             Contact counter for more details.
                                //         </div>
                                //         <div className="mt-4 text-white hover:text-amber-200 transition-colors">
                                //             <a
                                //                 href="#bus-route-table"
                                //                 className="flex items-center justify-center gap-1 font-medium"
                                //             >
                                //                 Check below for bus routes
                                //                 <svg
                                //                     xmlns="http://www.w3.org/2000/svg"
                                //                     className="h-4 w-4"
                                //                     fill="none"
                                //                     viewBox="0 0 24 24"
                                //                     stroke="currentColor"
                                //                 >
                                //                     <path
                                //                         strokeLinecap="round"
                                //                         strokeLinejoin="round"
                                //                         strokeWidth={2}
                                //                         d="M19 9l-7 7-7-7"
                                //                     />
                                //                 </svg>
                                //             </a>
                                //         </div>
                                //     </div>
                                // </div>
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
                                            Registration successful! We look
                                            forward to seeing you at the event.
                                        </div>
                                        {/* <iframe
                                            src="https://trk.clmbtrck.in/pixel?adid=682744e6f4c6db302a7a2a44"
                                            scrolling="no"
                                            frameBorder="0"
                                            width="1"
                                            height="1"
                                        ></iframe> */}
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
                                                    <FormMessageStyled>
                                                        {
                                                            form.formState
                                                                .errors.name
                                                                ?.message
                                                        }
                                                    </FormMessageStyled>
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
                                                    <FormMessageStyled>
                                                        {
                                                            form.formState
                                                                .errors.email
                                                                ?.message
                                                        }
                                                    </FormMessageStyled>
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
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white border-white/20"
                                                                >
                                                                    {phoneVerified
                                                                        ? "Verified"
                                                                        : phoneOtpSent
                                                                        ? "Resend"
                                                                        : "Send OTP"}
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <FormMessageStyled>
                                                            {
                                                                form.formState
                                                                    .errors
                                                                    .phone
                                                                    ?.message
                                                            }
                                                        </FormMessageStyled>
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
                                                                    onClick={
                                                                        handleVerifyPhoneOTP
                                                                    }
                                                                    disabled={
                                                                        submitting
                                                                    }
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                                                >
                                                                    Verify
                                                                </Button>
                                                            </div>
                                                            <FormMessageStyled>
                                                                {
                                                                    form
                                                                        .formState
                                                                        .errors
                                                                        .phoneOtp
                                                                        ?.message
                                                                }
                                                            </FormMessageStyled>
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
                                                                <SelectTrigger className="bg-white/90 border-zinc-300 w-full">
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
                                                        <FormMessageStyled>
                                                            {
                                                                form.formState
                                                                    .errors
                                                                    .state
                                                                    ?.message
                                                            }
                                                        </FormMessageStyled>
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
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            defaultValue={
                                                                field.value
                                                            }
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="bg-white/90 border-zinc-300 w-full">
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
                                                        <FormMessageStyled>
                                                            {
                                                                form.formState
                                                                    .errors.city
                                                                    ?.message
                                                            }
                                                        </FormMessageStyled>
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <FormField
                                                control={form.control}
                                                name="domain"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-white font-medium">
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
                                                                <SelectTrigger className="bg-white/90 border-zinc-300 w-full">
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
                                                        <FormMessageStyled>
                                                            {
                                                                form.formState
                                                                    .errors
                                                                    .domain
                                                                    ?.message
                                                            }
                                                        </FormMessageStyled>
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="education"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-white font-medium">
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
                                                                <SelectTrigger className="bg-white/90 border-zinc-300 w-full">
                                                                    <SelectValue placeholder="Select education" />
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
                                                        <FormMessageStyled>
                                                            {
                                                                form.formState
                                                                    .errors
                                                                    .education
                                                                    ?.message
                                                            }
                                                        </FormMessageStyled>
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
                                                        <FormLabel className="text-white font-medium">
                                                            Are you already
                                                            registered for
                                                            University
                                                            Counselling?
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />

                                        <p className="text-xs text-white/80">
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
                                                    "w-full rounded-lg bg-blue-600 px-5 py-2 font-medium text-white transition-all hover:bg-blue-700",
                                                    {
                                                        "cursor-wait opacity-70 hover:bg-blue-600":
                                                            submitting,
                                                    }
                                                )}
                                                disabled={
                                                    !phoneVerified || submitting
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
