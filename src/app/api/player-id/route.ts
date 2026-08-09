// This file belongs at: app/api/player-id/route.ts

import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

// A Redis counter key. INCR is atomic — even if two people hit "Generate"
// in the same millisecond, Redis processes each INCR as a single
// indivisible step, so nobody can ever be handed the same number. This is
// a hard structural guarantee, not just "very unlikely to collide."
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