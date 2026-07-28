import {createFileRoute} from "@tanstack/react-router";
import {Brand, GridBackground} from "@components/layout";
import {Button, Input, Main} from "@components/ui";
import {Lock} from "lucide-react";
import {cn, toast} from "#/lib/utils.ts";
import type {FormEvent} from "react";
import {changePasswordSchema} from "#/lib/zod/schema.ts";
import {useEyeToggle, useFormValue} from "#/hooks";

export const Route = createFileRoute("/auth/change-password")({
    component: ChangePassword,
    head: () => ({
        meta: [
            {
                title: "Change Password | Phone Book",
            },
        ],
    }),
});

function ChangePassword() {
    const passwordInput = useEyeToggle();
    const confirmPasswordInput = useEyeToggle();

    const {formValue, handleOnChange, errors, setErrors} =
        useFormValue<ChangePasswordFormValue>({
            password: "",
            confirmPassword: "",
        });

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = changePasswordSchema.safeParse(formValue);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors({
                password: fieldErrors.password?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
            });

            toast.error(
                "Validation Error",
                "Please check the highlighted fields."
            );

            return;
        }

        toast.success(
            "Password Updated",
            "Your password has been updated successfully."
        );
    };

    return (
        <Main className="flex flex-col justify-center">
            <div className="mx-auto flex h-fit w-full p-6 sm:p-12 md:p-16 lg:w-1/2">
                <GridBackground/>

                <div className="card mx-auto w-full max-w-lg p-10">
                    <header className="mb-5 flex flex-col items-center space-y-3 text-center">
                        <Brand/>

                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Create a new password
                        </h1>

                        <p className="max-w-md text-sm leading-6 text-muted-foreground">
                            Your new password must be different from your previous
                            password.
                        </p>
                    </header>

                    <form
                        className="space-y-5"
                        onSubmit={handleOnSubmit}
                    >
                        <Input
                            label="New Password"
                            name="password"
                            type={passwordInput.type}
                            value={formValue.password}
                            onChange={handleOnChange}
                            placeholder="Enter your new password"
                            leftIcon={<Lock size={16}/>}
                            state={errors.password ? "error" : "base"}
                            description={
                                errors.password ??
                                "Use at least 8 characters with a mix of letters, numbers, and symbols."
                            }
                            className={cn(
                                passwordInput.type === "password" && formValue.password
                                    ? "tracking-widest"
                                    : undefined
                            )}
                            rightIcon={
                                formValue.password ? (
                                    <button
                                        type="button"
                                        onClick={passwordInput.toggle}
                                        className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                        aria-label={
                                            passwordInput.type === "password"
                                                ? "Show password"
                                                : "Hide password"
                                        }
                                    >
                                        {passwordInput.icon}
                                    </button>
                                ) : null
                            }
                        />

                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type={confirmPasswordInput.type}
                            value={formValue.confirmPassword}
                            onChange={handleOnChange}
                            placeholder="Confirm your new password"
                            leftIcon={<Lock size={16}/>}
                            state={errors.confirmPassword ? "error" : "base"}
                            description={errors.confirmPassword}
                            className={cn(
                                confirmPasswordInput.type === "password" && formValue.confirmPassword
                                    ? "tracking-widest"
                                    : undefined
                            )}
                            rightIcon={
                                formValue.confirmPassword ? (
                                    <button
                                        type="button"
                                        onClick={confirmPasswordInput.toggle}
                                        className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                        aria-label={
                                            confirmPasswordInput.type === "password"
                                                ? "Show password"
                                                : "Hide password"
                                        }
                                    >
                                        {confirmPasswordInput.icon}
                                    </button>
                                ) : null
                            }
                        />

                        <Button
                            type="submit"
                            className="mt-2 w-full rounded-xl py-6 text-sm font-semibold"
                        >
                            Update Password
                        </Button>
                    </form>
                </div>
            </div>
        </Main>
    );
}