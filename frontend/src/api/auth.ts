import {deleteCookie, getRequest, setCookie} from "@tanstack/react-start/server";
import {createServerFn} from "@tanstack/react-start";

async function postAuthRequest<TData>(path: string, payload: unknown, init?: { token?: string }) {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...(init?.token ? {Authorization: init.token} : {}),
        },
        body: JSON.stringify(payload),
    });

    const result = (await response.json().catch(() => ({}))) as AuthApiResult<TData>;

    if (!response.ok) {
        throw {
            message: result.detail ?? result.message ?? "Something went wrong.",
            status: response.status,
            errors: result?.errors ?? null,
        };
    }

    return result;
}

function getCookieValue(cookieName: string) {
    const request = getRequest();
    const cookieHeader = request.headers.get("cookie") ?? "";

    return cookieHeader
        .split(";")
        .map((cookie) => cookie.trim())
        .find((cookie) => cookie.startsWith(`${cookieName}=`))
        ?.split("=")[1] ?? "";
}

function setAuthCookie(name: string, value: string, maxAge: number) {
    setCookie(name, value, {
        httpOnly: true,
        secure: import.meta.env.ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge,
    });
}

export const signInFn = createServerFn({method: "POST"})
    .validator((data: SignInFormValue) => data)
    .handler(async ({data}) => postAuthRequest<SignInResponse>("/auth/sign-in", data));

export const signUp = createServerFn({method: "POST"})
    .validator((data: SignUpFormValue) => data)
    .handler(async ({data}) => postAuthRequest<ForgotPasswordResponse>("/auth/sign-up", data));

export const forgotPassword = createServerFn({method: "POST"})
    .validator((data: ForgotPasswordFormValue) => data)
    .handler(async ({data}) => {
        const result = await postAuthRequest<{ token: string }>("/auth/forgot-password", data);

        if (result.data?.token) {
            setAuthCookie("password-reset-request", result.data.token, 900);
        }

        return result;
    });

export const verifyEmail = createServerFn({method: "POST"})
    .validator((data: VerifyEmailFormValue) => data)
    .handler(async ({data}) => {
        const token = getCookieValue("password-reset-request");
        const result = await postAuthRequest<VerifyEmailResponse>('/auth/verify-email', data, {token});

        if (result.data?.token) {
            setAuthCookie("password-reset", result.data.token, 900);
        }

        deleteCookie("password-reset-request");

        return result;
    });

export const changePassword = createServerFn({method: "POST"})
    .validator((data: ChangePasswordFormValue) => data)
    .handler(async ({data}) => {
        const token = getCookieValue("password-reset");
        const result = await postAuthRequest<ChangeNameResponse>("/auth/change-password", data, {token});

        deleteCookie("password-reset");

        return result;
    });

