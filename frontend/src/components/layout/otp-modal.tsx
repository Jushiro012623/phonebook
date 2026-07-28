import {Button, InputOtp} from "@components/ui";
import {ShieldCheck} from "lucide-react";
import {Brand} from "@components/layout/brand";
import {OTP_LENGTH} from "#/constants.ts";

type OtpModalProps = {
    email: string;
    otp: string;
    onOtpChange: (value: string) => void;
    onVerify: () => void;
    onResend: () => void;
    timeLeft: string;
    open: boolean;
};

export function OtpModal({
                             email,
                             otp,
                             onOtpChange,
                             onVerify,
                             onResend,
                             timeLeft,
                             open,
                         }: OtpModalProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="card w-full max-w-lg animate-in fade-in zoom-in-95 duration-200 p-10">
                <header className="mb-8 text-center lg:text-left">
                    <Brand/>
                    <h2 className="text-3xl font-bold">
                        Verify Email
                    </h2>

                    <p className="mt-3 text-sm text-muted-foreground">
                        We've sent a 6-digit verification code to
                    </p>

                    <p className="mt-1 break-all font-medium text-primary">
                        {email}
                    </p>
                </header>

                <div className="my-10 flex justify-center">
                    <InputOtp
                        length={OTP_LENGTH}
                        value={otp}
                        onChange={onOtpChange}
                    />
                </div>

                <Button
                    className="w-full rounded-xl py-6 text-sm font-semibold"
                    disabled={otp.length !== OTP_LENGTH}
                    onClick={onVerify}
                >
                    Verify Email
                </Button>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-primary"/>
                    <span>Verification code expires in 5 minutes.</span>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Didn't receive the code?
                    </p>

                    <button
                        type="button"
                        onClick={onResend}
                        disabled={timeLeft !== "00:00"}
                        className="mt-2 text-sm font-semibold text-primary transition hover:text-primary/80 disabled:cursor-not-allowed disabled:text-muted-foreground"
                    >
                        {timeLeft === "00:00"
                            ? "Resend Code"
                            : `Resend in ${timeLeft}`}
                    </button>
                </div>
            </div>
        </div>
    );
}