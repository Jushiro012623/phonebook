import {createFileRoute, Link} from '@tanstack/react-router'
import {type FormEvent} from "react";
import {Lock, Mail, User} from "lucide-react";
import {Button, Input, Main} from "#/components/ui";
import {Brand, GridBackground} from "@components/layout";
import {cn, toast} from "#/lib/utils.ts";
import {useEyeToggle} from "#/hooks";
import {useFormValue} from "#/hooks/useFormValue.tsx";
import {signUpSchema} from "#/lib/zod/schema.ts";

export const Route = createFileRoute("/auth/sign-up")({
    component: SignUp,
    head: () => ({
        meta: [
            {
                title: 'Sign Up | Phone Book',
            }
        ]
    })
});

function SignUp() {

    const passwordInput = useEyeToggle()
    const confirmPasswordInput = useEyeToggle()

    const {errors, setErrors, handleOnChange, formValue} = useFormValue<SignUpFormValue>({
        username: "", password: "", confirmPassword: "", email: ""
    })
    const {confirmPassword, password, email, username} = formValue

    const handleOnSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const result = signUpSchema.safeParse(formValue);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;

            setErrors({
                username: fieldErrors.username?.[0],
                password: fieldErrors.password?.[0],
                confirmPassword: fieldErrors.confirmPassword?.[0],
                email: fieldErrors.email?.[0],
            })

            toast.error("Validation Error", "Please check the highlighted fields.");
            return;
        }

        toast.success("SUCCESS", "ACCOUNT CREATED SUCCESSFULLY")
    }

    return (
        <Main className="flex flex-col justify-center">
            <div className="mx-auto flex h-fit w-full p-6 sm:p-12 md:p-16 lg:w-1/2">
                <GridBackground/>

                <div className="card mx-auto w-full max-w-lg p-10">
                    <header className="mb-8 text-center lg:text-left">
                        <Brand/>

                        <h1 className="text-3xl font-bold md:text-4xl">
                            Create Account
                        </h1>

                        <p className="mt-3 text-sm text-muted-foreground">
                            Sign up to manage your contacts securely.
                        </p>
                    </header>

                    <form className="space-y-5" onSubmit={handleOnSubmit}>
                        <div className="space-y-4">
                            <Input
                                label="Username"
                                placeholder="johndoe"
                                leftIcon={<User size={16}/>}
                                name="username"
                                state={errors.username ? 'error' : 'base'}
                                description={errors.username}
                                value={username}
                                onChange={handleOnChange}
                            />

                            <Input
                                label="Email Address"
                                type="email"
                                name="email"
                                state={errors.email ? 'error' : 'base'}
                                description={errors.email}
                                value={email}
                                onChange={handleOnChange}
                                placeholder="john@example.com"
                                leftIcon={<Mail size={16}/>}
                            />

                            <Input
                                label="Password"
                                type={passwordInput.type}
                                name="password"
                                value={password}
                                onChange={handleOnChange}
                                placeholder="••••••••"
                                state={errors.password ? 'error' : 'base'}
                                description={errors.password}
                                className={cn(passwordInput.type === 'password' ? "tracking-widest" : null)}
                                leftIcon={<Lock size={16}/>}
                                rightIcon={
                                    password ? (
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
                                type={confirmPasswordInput.type}
                                placeholder="••••••••"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={handleOnChange}
                                state={errors.confirmPassword ? 'error' : 'base'}
                                description={errors.confirmPassword}
                                className={cn(confirmPasswordInput.type === 'password' ? "tracking-widest" : null)}
                                leftIcon={<Lock size={16}/>}
                                rightIcon={
                                    confirmPassword ? (
                                        <button
                                            type="button"
                                            onClick={confirmPasswordInput.toggle}
                                            className="flex items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            {confirmPasswordInput.icon}
                                        </button>
                                    ) : null
                                }
                            />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full rounded-xl py-6 text-sm font-semibold">
                            Create Account
                        </Button>
                    </form>

                    <div className="relative py-5">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"/>
                        </div>

                        <div className="relative flex justify-center">
                            <span
                                className="bg-background px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Already Have an Account?
                            </span>
                        </div>
                    </div>

                    <Link to="/auth/sign-in">
                        <Button
                            variant="secondary"
                            className="w-full rounded-xl py-6 text-sm font-semibold"
                        >
                            Sign In
                        </Button>
                    </Link>
                </div>
            </div>
        </Main>
    );
}