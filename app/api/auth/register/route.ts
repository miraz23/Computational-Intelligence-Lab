import { ACADEMIC_ROLES, AcademicRole, RegisterApiPayload, RegisterApiResponse } from "@/lib/types/auth/register";
import { NextRequest, NextResponse } from "next/server";

function isAcademicRole(value: unknown): value is AcademicRole {
    return typeof value === "string" && (ACADEMIC_ROLES as readonly string[]).includes(value);
}

export async function POST(request: NextRequest): Promise<NextResponse<RegisterApiResponse>> {
    const body = (await request.json()) as Partial<RegisterApiPayload>;
    const { name, email, password, scholarId, institution, role } = body;

    if (!name || !email || !password || !scholarId || !institution || !isAcademicRole(role)) {
        return NextResponse.json(
            { success: false, message: "Missing or invalid required fields." },
            { status: 400 }
        );
    }

    if (password.length < 8) {
        return NextResponse.json(
            { success: false, message: "Password must be at least 8 characters." },
            { status: 400 }
        );
    }

    // TODO: hash password, check for existing email/scholarId, persist to DB, send verification email.

    return NextResponse.json({
        success: true,
        message: "Account created.",
        userId: crypto.randomUUID(),
    });
}