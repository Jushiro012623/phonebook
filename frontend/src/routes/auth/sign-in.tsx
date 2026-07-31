import {createFileRoute, Link, useNavigate} from '@tanstack/react-router'
import {Button, Input, Main} from '#/components/ui'
import {Brand, GridBackground} from "@components/layout";
import {Lock, Mail} from "lucide-react";
import {cn, toast} from "#/lib/utils.ts";
import {useEyeToggle, useFormValue} from "#/hooks";
import {type FormEvent, useState} from "react";
import {signInSchema} from "#/lib/zod/schema.ts";
import {signInFn} from "#/api/auth.ts";
import {handleAuthFormError} from "#/lib/auth-form";

export const Route = createFileRoute('/auth/sign-in')({
    component: SignIn,
    head: () => ({
        meta: [
            {
                title: 'Sign In | Phone Book',
            }
        ]
    })
})

function SignIn() {

    const navigate = useNavigate()
    const passwordInput = useEyeToggle()

    const {formValue, handleOnChange, errors, setErrors} = useFormValue<SignInFormValue>({username: '', password: ''});

    const [rememberMe, setRememberMe] = useState(false);

    const handleOnSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const result = signInSchema.safeParse(formValue);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors({
                username: fieldErrors.username?.[0],
                password: fieldErrors.password?.[0],
            });

            toast.error("Validation Error", "Please check the highlighted fields.");
            return;
        }

        try {
            const response = await signInFn({data: formValue,});
            toast.success("Login Successful", response.message);
            await navigate({to: "/"});
        } catch (error) {
            handleAuthFormError(error, "Sign In Failed", setErrors);
        }
    };

    return (
        <Main className="flex flex-col justify-center">
            <div className="mx-auto flex h-fit w-full  p-6 sm:p-12 md:p-16 lg:w-1/2">
                <GridBackground/>
                <div className="card p-10 mx-auto w-full max-w-lg">
                    <header className="mb-5 space-y-3 text-center flex flex-col items-center">
                        <Brand/>
                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Sign in to your account
                        </h1>
                        <p className="max-w-md text-sm leading-6 text-muted-foreground">
                            Access your contacts and manage your directory securely in one place.
                        </p>
                    </header>
                    <form className="space-y-5" onSubmit={handleOnSubmit}>
                        <div className="space-y-4">
                            <Input
                                label="Email or Username"
                                name="username"
                                value={formValue.username}
                                onChange={handleOnChange}
                                placeholder="john@example.com"
                                leftIcon={<Mail size={16}/>}
                                state={errors.username ? 'error' : 'base'}
                                description={errors.username}
                            />

                            <Input
                                label="Password"
                                type={passwordInput.type}
                                className={cn(passwordInput.type === 'password' ? "tracking-widest" : null)}
                                placeholder="••••••••"
                                value={formValue.password}
                                name="password"
                                onChange={handleOnChange}
                                state={errors.password ? 'error' : 'base'}
                                description={errors.password}
                                leftIcon={<Lock size={16}/>}
                                rightIcon={
                                    formValue.password ? (
                                        <button
                                            type="button"
                                            onClick={passwordInput.toggle}
                                            className="flex items-center justify-center text-muted-foreground transition-colors "
                                        >
                                            {passwordInput.icon}
                                        </button>
                                    ) : null
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-muted-foreground">
                                <input
                                    type="checkbox"
                                    className="rounded border-border"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                Remember me
                            </label>

                            <Link
                                to="/auth/forgot-password"
                                className="font-medium text-primary transition-colors hover:text-primary/80"
                            >
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" className="mt-2 w-full rounded-xl py-6 text-sm font-semibold">
                            Sign In
                        </Button>
                    </form>

                    <div className="relative py-5">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"/>
                        </div>

                        <div className="relative flex justify-center">
                            <span
                                className="bg-background px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Don't Have an Account?
                            </span>
                        </div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground">
                        <Link
                            to="/auth/sign-up"
                        >
                            <Button
                                variant="secondary"
                                className="w-full rounded-xl py-6 text-sm font-semibold">
                                Create Account
                            </Button>
                        </Link>
                    </p>
                </div>
            </div>
        </Main>
    )
}