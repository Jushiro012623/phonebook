import {z} from "zod";

export const signUpSchema = z.object({
    username: z.string().min(8, "Username must be at least 8 Characters"),
    email: z.email("Email must be a valid email address").min(8, "Email must be at least 8 Characters"),
    password: z.string().min(8, "Password must be at least 8 Characters"),
    confirmPassword: z.string().min(1, "Confirm Password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export const signInSchema = z.object({
    username: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
})

export const forgotPasswordSchema = z.object({
    email: z.email("Please enter a valid email address").min(1, "Email is required"),
});

export const changePasswordSchema = z.object({
    password: z.string().min(1, "Password is required"),
    confirmPassword: z.string().min(1, "Confirm Password is required")
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
