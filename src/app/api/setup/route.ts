import { initDatabase } from "@/lib/neon";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    if (!process.env.DATABASE_URL && !process.env.NEON_DATABASE_URL && !process.env.POSTGRES_URL) {
      return NextResponse.json(
        { error: "No database URL configured. Connect Neon to Vercel first." },
        { status: 400 }
      );
    }

    await initDatabase();
    return NextResponse.json({ status: "ok", message: "Database initialized" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
