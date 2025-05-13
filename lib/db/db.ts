import mongoose from "mongoose";
import { serverEnv } from "@/lib/env/server";

// MongoDB connection string
const MONGODB_URI = serverEnv.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = serverEnv.MONGODB_DB || "auth_system";

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
        const opts = {
            bufferCommands: true,
        };

        cached.promise = mongoose.connect(`${MONGODB_URI}/${MONGODB_DB}`, opts);
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
