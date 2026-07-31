import * as React from "react";

declare global {
    type SignInFormValue = {
        username: string;
        password: string;
    }

    type SignUpFormValue = {
        username: string;
        password: string;
        email: string;
        confirmPassword: string;
    }

    type ForgotPasswordFormValue = {
        email: string;
    }

    type VerifyEmailFormValue = {
        otp: string;
        reference: string;
    }

    type ChangePasswordFormValue = {
        password: string;
        confirmPassword: string;
    }

    type FormPassword = "text" | "password";

    type SVGProps = React.SVGProps<SVGSVGElement>;

    type AuthApiError = {
        message?: string;
        detail?: string;
        errors?: Array<{ field: string; message: string[] }>;
    };

    type AuthApiResult<TData = Record<string, any>> = {
        message: string;
        data?: TData;
        detail?: string;
        errors?: Array<{
            field: string;
            message: string[];
        }>;
    };

    interface SignInResponse {
        accessToken: string;
        user: User;
    }

    interface ForgotPasswordResponse {
        token: string;
    }

    interface VerifyEmailResponse {
        token: string;
    }

    interface ChangeNameResponse {
        verified: boolean,
        token: string,
        expiresIn: number,
    }

}

export {};
