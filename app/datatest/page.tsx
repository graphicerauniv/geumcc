"use client";

import { FormEvent, useEffect, useState } from "react";

type SessionState = {
    authenticated: boolean;
    configured: boolean;
    message?: string;
};

export default function DatatestPage() {
    const [session, setSession] = useState<SessionState | null>(null);
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadSession = async () => {
        const response = await fetch("/mcc/api/datatest/session", {
            method: "GET",
            cache: "no-store",
        });
        const data = (await response.json()) as SessionState;
        setSession(data);
    };

    useEffect(() => {
        loadSession().catch(() => {
            setError("Unable to load login status");
        });
    }, []);

    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await fetch("/mcc/api/datatest/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ loginId, password }),
            });
            const data = (await response.json()) as { message?: string };
            if (!response.ok) {
                setError(data.message || "Login failed");
                return;
            }
            setLoginId("");
            setPassword("");
            await loadSession();
        } catch {
            setError("Login failed");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        setLoading(true);
        setError("");
        try {
            await fetch("/mcc/api/datatest/logout", { method: "POST" });
            await loadSession();
        } catch {
            setError("Logout failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-6 shadow-md">
                <h1 className="mb-2 text-2xl font-semibold text-slate-900">
                    MCC Data Download
                </h1>
                <p className="mb-6 text-sm text-slate-600">
                    Login with credentials from `.env.local` and download the
                    submitted form data as an Excel-compatible CSV file.
                </p>

                {session && !session.configured && (
                    <p className="mb-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                        {session.message}
                    </p>
                )}

                {error && (
                    <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {session?.authenticated ? (
                    <div className="space-y-3">
                        <a
                            href="/mcc/api/datatest/download"
                            className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                        >
                            Download Data (CSV for Excel)
                        </a>
                        <button
                            type="button"
                            onClick={handleLogout}
                            disabled={loading}
                            className="w-full rounded-md border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label
                                htmlFor="loginId"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Login ID
                            </label>
                            <input
                                id="loginId"
                                value={loginId}
                                onChange={(e) => setLoginId(e.target.value)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                                autoComplete="username"
                                required
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1 block text-sm font-medium text-slate-700"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !session?.configured}
                            className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
                        >
                            {loading ? "Signing in..." : "Login"}
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}

