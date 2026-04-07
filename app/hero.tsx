"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Script from "next/script";
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
import logo from "@/assets/geu-white.webp";

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
                          <Script
    src="https://widgets.in4.nopaperforms.com/emwgts.js"strategy="afterInteractive"
  />
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
    "bg-white/10 backdrop-blur-lg rounded-3xl border-2 border-white/20 p-6 md:p-8 max-w-md ml-auto w-full shadow-xl"
  )}
>
  <div
    className="npf_wgts"
    data-height="590px"
    data-w="0fbd2a389052cbcbd8ba56e626b93a46"
    style={{ minHeight: "590px", width: "100%" }}
  ></div>
</div>
                    </div>
                </div>
            </div>
        </main>
    );
}