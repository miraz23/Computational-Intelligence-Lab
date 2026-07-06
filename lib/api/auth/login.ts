import { LoginApiPayload, LoginApiResponse } from "@/lib/types/auth/login";

export class LoginApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "LoginApiError";
        this.status = status;
    }
}

export async function submitLoginApplication(
    payload: LoginApiPayload
): Promise<LoginApiResponse> {
    let response: Response;

    try {
        response = await fetch("/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    } catch {
        throw new LoginApiError("Network error. Check your connection and try again.", 0);
    }

    let data: LoginApiResponse;

    try {
        data = (await response.json()) as LoginApiResponse;
    } catch {
        throw new LoginApiError("Unexpected server response.", response.status);
    }

    if (!response.ok || !data.success) {
        throw new LoginApiError(data.message ?? "Something went wrong. Please try again.", response.status);
    }

    return data;
}