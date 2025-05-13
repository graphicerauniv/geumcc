import type { Metadata } from "next";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";
import Script from "next/script";

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
            <head>
                {/* Google Ads tag */}
                <Script
                    async
                    src="https://www.googletagmanager.com/gtag/js?id=AW-823971696"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag() {
                            dataLayer.push(arguments);
                        }
                        gtag("js", new Date());

                        gtag("config", "AW-823971696");
                        gtag("config", "UA-121779352-10");
                    `}
                </Script>

                {/* Meta Pixel Code */}
                <Script id="facebook-pixel" strategy="afterInteractive">
                    {`
                        (function (f, b, e, v, n, t, s) {
                            if (f.fbq) return;
                            n = f.fbq = function () {
                                n.callMethod
                                    ? n.callMethod.apply(n, arguments)
                                    : n.queue.push(arguments);
                            };
                            if (!f._fbq) f._fbq = n;
                            n.push = n;
                            n.loaded = !0;
                            n.version = "2.0";
                            n.queue = [];
                            t = b.createElement(e);
                            t.async = !0;
                            t.src = v;
                            s = b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t, s);
                        })(
                            window,
                            document,
                            "script",
                            "https://connect.facebook.net/en_US/fbevents.js",
                        );
                        fbq("init", "248650016295389");
                        fbq("track", "PageView");
                    `}
                </Script>

                {/* Microsoft Clarity */}
                <Script id="microsoft-clarity" strategy="afterInteractive">
                    {`
                        (function (c, l, a, r, i, t, y) {
                            c[a] =
                                c[a] ||
                                function () {
                                    (c[a].q = c[a].q || []).push(arguments);
                                };
                            t = l.createElement(r);
                            t.async = 1;
                            t.src = "https://www.clarity.ms/tag/" + i;
                            y = l.getElementsByTagName(r)[0];
                            y.parentNode.insertBefore(t, y);
                        })(window, document, "clarity", "script", "6p8i0joevd");
                    `}
                </Script>
            </head>
            <body className="min-h-screen bg-background">
                <main className="">{children}</main>
                {/* <Footer /> */}
                <Toaster />
            </body>
        </html>
    );
}
