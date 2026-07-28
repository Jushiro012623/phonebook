import {createFileRoute, Link} from "@tanstack/react-router";
import {type FormEvent} from "react";
import {ArrowLeft, Mail} from "lucide-react";

import {Button, Input, Main} from "#/components/ui";
import {Brand, GridBackground} from "@components/layout";
import {toast} from "#/lib/utils";
import {useFormValue} from "#/hooks";
import {forgotPasswordSchema} from "#/lib/zod/schema";

export const Route = createFileRoute("/auth/forgot-password")({
    component: ForgotPassword,
    head: () => ({
        meta: [
            {
                title: "Forgot Password | Phone Book",
            },
        ],
    }),
});

function ForgotPassword() {

    const {formValue, handleOnChange, errors, setErrors} = useFormValue<ForgotPasswordFormValue>({email: "",});

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = forgotPasswordSchema.safeParse(formValue);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors({
                email: fieldErrors.email?.[0],
            });

            toast.error(
                "Validation Error",
                "Please enter a valid email address."
            );

            return;
        }

        toast.success(
            "Email Sent",
            "If an account exists, a password reset link has been sent."
        );
    };

    return (
        <Main className="flex flex-col justify-center">
            <div className="mx-auto flex h-fit w-full p-6 sm:p-12 md:p-16 lg:w-1/2">
                <GridBackground/>

                <div className="card mx-auto w-full max-w-lg p-10">
                    <header className="mb-8 text-center lg:text-left">
                        <Brand/>

                        <h1 className="text-3xl font-bold md:text-4xl">
                            Forgot Password
                        </h1>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Enter the email address associated with your account.
                            We'll send you a link to reset your password.
                        </p>
                    </header>

                    <form
                        className="space-y-5"
                        onSubmit={handleOnSubmit}
                    >
                        <Input
                            label="Email Address"
                            name="email"
                            type="email"
                            value={formValue.email}
                            onChange={handleOnChange}
                            placeholder="john@example.com"
                            leftIcon={<Mail size={16}/>}
                            state={errors.email ? "error" : "base"}
                            description={errors.email}
                        />

                        <Button
                            type="submit"
                            className="w-full rounded-xl py-6 text-sm font-semibold"
                        >
                            Send Reset Link
                        </Button>
                    </form>

                    <div className="mt-8">
                        <Link
                            to="/auth/sign-in"
                            className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                        >
                            <ArrowLeft size={16}/>
                            Back to Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </Main>
    );
}