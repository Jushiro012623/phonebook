import {deleteCookie} from "@tanstack/react-start/server";
import {createServerFn} from "@tanstack/react-start";
import {getCookieValue, requestServer, setAuthCookie} from "#/api/request.ts";

export const signInFn = createServerFn({method: "POST"})
    .validator((data: SignInFormValue) => data)
    .handler(async ({data}) => {
        const result = await requestServer<SignInResponse>("/auth/sign-in", {method: "POST", body: data});

        if (result.data?.accessToken) {
            setAuthCookie("access-token", result.data.accessToken, 900);
        }
        return result;
    })
;

export const signUp = createServerFn({method: "POST"})
    .validator((data: SignUpFormValue) => data)
    .handler(async ({data}) => requestServer<ForgotPasswordResponse>("/auth/sign-up", {method: "POST", body: data}));

export const forgotPassword = createServerFn({method: "POST"})
    .validator((data: ForgotPasswordFormValue) => data)
    .handler(async ({data}) => {
        const result = await requestServer<{ token: string }>("/auth/forgot-password", {method: "POST", body: data});

        if (result.data?.token) {
            setAuthCookie("password-reset-requestServer", result.data.token, 900);
        }

        return result;
    });

export const verifyEmail = createServerFn({method: "POST"})
    .validator((data: VerifyEmailFormValue) => data)
    .handler(async ({data}) => {
        const token = getCookieValue("password-reset-requestServer");
        const result = await requestServer<VerifyEmailResponse>('/auth/verify-email', {
            method: "POST",
            body: data,
            token
        });

        if (result.data?.token) {
            setAuthCookie("password-reset", result.data.token, 900);
        }

        deleteCookie("password-reset-requestServer");

        return result;
    });

export const changePassword = createServerFn({method: "POST"})
    .validator((data: ChangePasswordFormValue) => data)
    .handler(async ({data}) => {
        const token = getCookieValue("password-reset");
        const result = await requestServer<ChangeNameResponse>("/auth/change-password", {
            method: "POST",
            body: data,
            token
        });

        deleteCookie("password-reset");

        return result;
    });

