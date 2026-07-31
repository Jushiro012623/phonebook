export interface ApiFieldError {
    field: string;
    message: string[];
}

export interface ApiErrorResponse {
    message: string;
    status?: number;
    errors?: ApiFieldError[];
}

export type ApiError = {
    title: string;
    message: string;
    status: number;
    errors?: unknown;
};

export function throwApiError(
    response: Response,
    result: Record<string, any>,
): never {
    throw {
        title: result.title ?? "Internal Server Error",
        message:
            result.detail ??
            result.message ??
            "Something went wrong.",
        status: response.status,
        errors: result.errors,
    } satisfies ApiError;
}


export function parseApiError(error: unknown) {
    const fieldErrors: Record<string, string> = {};

    let message = "Something went wrong.";

    if (error && typeof error === "object") {
        const apiError = error as ApiErrorResponse;

        message = apiError.message ?? message;

        apiError.errors?.forEach((err) => {
            fieldErrors[err.field] = err.message[0];
        });
    } else if (error instanceof Error) {
        message = error.message;
    }

    return {
        message,
        fieldErrors,
    };
}