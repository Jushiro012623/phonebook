import {getRequest, setCookie} from "@tanstack/react-start/server";

export async function requestServer<TData>(
    path: string,
    options: RequestOptions = {},
): Promise<ApiResult<TData>> {
    const {
        method = "GET",
        body,
        token,
        headers,
        ...fetchOptions
    } = options;

    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        method,
        headers: {
            ...(body ? {"Content-Type": "application/json"} : {}),
            ...(token ? {Authorization: `Bearer ${token}`} : {}),
            ...headers,
        },
        ...(body ? {body: JSON.stringify(body)} : {}),
        ...fetchOptions,
    });

    const result = (await response.json().catch(() => ({}))) as ApiResult<TData>;

    if (!response.ok) {
        throw {
            title: result.title ?? "Request Failed",
            message: result.detail ?? result.message ?? "Something went wrong.",
            status: response.status,
            errors: result.errors ?? null,
        };
    }

    return result;
}

export function getCookieValue(cookieName: string) {
    const request = getRequest();
    const cookieHeader = request.headers.get("cookie") ?? "";

    return cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${cookieName}=`))
        ?.split("=")[1] ?? "";
}

export function setAuthCookie(name: string, value: string, maxAge: number) {
    setCookie(name, value, {
        httpOnly: true,
        secure: import.meta.env.ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge,
    });
}
