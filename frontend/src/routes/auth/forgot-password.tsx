import {createFileRoute, Link, useNavigate} from "@tanstack/react-router";
import {type FormEvent, useEffect, useState} from "react";
import {ArrowLeft, Mail} from "lucide-react";
import {Button, Input, Main} from "#/components/ui";
import {Brand, GridBackground, OtpModal} from "@components/layout";
import {toast} from "#/lib/utils";
import {useFormValue} from "#/hooks";
import {forgotPasswordSchema} from "#/lib/zod/schema";
import {RESEND_SECONDS} from "#/constants.ts";

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
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [opt, setOtp] = useState<string>('')
    const [resendTimer, setResendTimer] = useState<number>(0)
    const navigate = useNavigate()
    useEffect(() => {
        if (resendTimer <= 0) return;

        const timer = setInterval(() => {
            setResendTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [resendTimer]);

    const formattedTime = `${String(Math.floor(resendTimer / 60)).padStart(2, "0")}:${String(
        resendTimer % 60
    ).padStart(2, "0")}`;

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

        setIsModalOpen(true);
        setResendTimer(RESEND_SECONDS);

        toast.success("OTP Sent", "Please check your email.");
    };

    const handleResendOTP = () => {
        setOtp('')
        setResendTimer(RESEND_SECONDS);
        toast.success("OTP Sent", "Please check your email.");
    }

    const handleVerifyOTP = () => {
        setIsModalOpen(false)
        toast.success("Success", "Email Verified Success.");
        return navigate({to: '/auth/change-password'})
    }
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
            <OtpModal
                open={isModalOpen}
                email={formValue.email}
                otp={opt}
                onOtpChange={setOtp}
                onVerify={handleVerifyOTP}
                onResend={handleResendOTP}
                timeLeft={formattedTime}/>
        </Main>
    );
}