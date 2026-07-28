import {createFileRoute} from '@tanstack/react-router'
import {Brand, GridBackground} from "@components/layout";
import {Button, Input, Main} from "@components/ui";
import {Lock} from "lucide-react";
import {toast} from "#/lib/utils.ts";
import type {FormEvent} from "react";
import {changePasswordSchema} from "#/lib/zod/schema.ts";
import {useFormValue} from "#/hooks";

export const Route = createFileRoute('/auth/change-password')({
    component: RouteComponent,
})

function RouteComponent() {

    const {formValue, handleOnChange, errors, setErrors} = useFormValue<ChangePasswordFormValue>({
        confirmPassword: "",
        password: "",
    });
    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const result = changePasswordSchema.safeParse(formValue);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors({
                password: fieldErrors.password?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
            });

            toast.error("Validation Error", "Please check the highlighted fields.");

            return;
        }

        toast.success("Success", "Password changed successfully")
    }

    return (
        <Main className="flex flex-col justify-center">
            <div className="mx-auto flex h-fit w-full p-6 sm:p-12 md:p-16 lg:w-1/2">
                <GridBackground/>

                <div className="card mx-auto w-full max-w-lg p-10">
                    <header className="mb-8 text-center lg:text-left">
                        <Brand/>

                        <h1 className="text-3xl font-bold md:text-4xl">
                            Change Password
                        </h1>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Enter your new password
                        </p>
                    </header>

                    <form
                        className="space-y-5"
                        onSubmit={handleOnSubmit}
                    >
                        <Input
                            label="Password"
                            name="password"
                            type="password"
                            value={formValue.password}
                            onChange={handleOnChange}
                            leftIcon={<Lock size={16}/>}
                            placeholder="••••••••"
                            state={errors.password ? 'error' : 'base'}
                            description={errors.password ?? "Use at least 8 characters with a mix of letters, numbers, and symbols for better security."}
                        />
                        <Input
                            label="Confirm Password"
                            name="confirmPassword"
                            type="password"
                            onChange={handleOnChange}
                            value={formValue.confirmPassword}
                            placeholder="••••••••"
                            state={errors.confirmPassword ? 'error' : 'base'}
                            description={errors.confirmPassword}
                            leftIcon={<Lock size={16}/>}
                        />

                        <Button
                            type="submit"
                            className="w-full rounded-xl py-6 text-sm font-semibold"
                        >
                            Change Password
                        </Button>
                    </form>

                </div>
            </div>
        </Main>
    )
}
