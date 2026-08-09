import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();
const COUNTER_KEY = "hhg:player-id-counter";

export async function POST() {
  try {
    const n = await redis.incr(COUNTER_KEY);
    const id = `HHG-2026-${String(n).padStart(6, "0")}`;
    return NextResponse.json({ id });
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}