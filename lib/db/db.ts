import mongoose from "mongoose";
import { serverEnv } from "@/lib/env/server";

// MongoDB connection string
const MONGODB_URI = serverEnv.MONGODB_URI;
const MONGODB_DB = serverEnv.MONGODB_DB;

// Database connection
interface ConnectionCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: ConnectionCache | undefined;
}

let cached: ConnectionCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
    global.mongoose = cached;
}

export async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not configured");
        }

        const opts = {
            bufferCommands: true,
            dbName: MONGODB_DB || undefined,
            serverSelectionTimeoutMS: 10000,
            family: 4,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts);
    }

    try {
        cached.conn = await cached.promise;
        return cached.conn;
    } catch (error) {
        // Allow retries with updated env/config instead of keeping a rejected promise forever.
        cached.promise = null;
        cached.conn = null;
        throw error;
    }
}
