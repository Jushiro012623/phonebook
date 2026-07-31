export interface ApiFieldError {
    field: string;
    message: string[];
}

export interface ApiErrorResponse {
    message: string;
    status?: number;
    errors?: ApiFieldError[];
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