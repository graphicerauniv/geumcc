import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

export const metadata: Metadata = {
    title: "Graphic Era MCC - Graphic Era Mega Career Counselling",
    description:
        "Graphic Era Mega Career Counselling application and management",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className="min-h-screen bg-background">
                <main className="">{children}</main>
                {/* <Footer /> */}
                <Toaster />
            </body>
        </html>
    );
}
