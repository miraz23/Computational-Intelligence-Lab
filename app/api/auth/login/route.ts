import { LoginApiPayload, LoginApiResponse } from "@/lib/types/auth/login";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse<LoginApiResponse>> {
    const body = (await request.json()) as Partial<LoginApiPayload>;
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json(
            { success: false, message: "Email and password are required." },
            { status: 400 }
        );
    }

    // TODO: look up user by email, verify password hash, create session/JWT.

    return NextResponse.json({
        success: true,
        message: "Logged in successfully.",
        userId: crypto.randomUUID(),
        token: "TODO-issue-real-token",
    });
}