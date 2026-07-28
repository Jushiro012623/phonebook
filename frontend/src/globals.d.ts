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

    type ChangePasswordFormValue = {
        password: string;
        confirmPassword: string;
    }

    type FormPassword = "text" | "password";

    type SVGProps = React.SVGProps<SVGSVGElement>;

}

export {};
