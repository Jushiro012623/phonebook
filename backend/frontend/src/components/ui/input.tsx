import * as React from "react";
import clsx from "clsx";

type InputState = "base" | "error" | "warning" | "success";
type InputSize = "sm" | "md" | "lg";

type ClassNames = {
    label?: string;
    description?: string;
    input?: string;
};

type InputProps = {
    label?: string;
    description?: string;
    state?: InputState;
    size?: InputSize;
    className?: string;
    classNames?: ClassNames;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<"input">, "size">;

export const Input = ({
                          label,
                          description,
                          state = "base",
                          size = "md",
                          className,
                          classNames,
                          id,
                          leftIcon,
                          rightIcon,
                          ...props
                      }: InputProps) => {
    const inputId = id ?? React.useId();

    const stateClasses: Record<InputState, string> = {
        base: "",
        error: "border-red-500 focus:ring-red-500",
        warning: "border-yellow-500 focus:ring-yellow-500",
        success: "border-teal-500 focus:ring-teal-500",
    };

    const sizeClasses = {
        sm: "h-8 text-sm px-3",
        md: "h-10 text-sm px-4",
        lg: "h-12 text-base px-5",
    } satisfies Record<InputSize, string>;

    return (
        <div className="flex flex-col space-y-1">
            {label && (
                <label htmlFor={inputId} className={clsx("label", classNames?.label)}>
                    {label}
                </label>
            )}

            <div className="relative w-full">
                {leftIcon && (
                    <div
                        className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground">
                        {leftIcon}
                    </div>
                )}

                <input
                    id={inputId}
                    {...props}
                    className={clsx(
                        "input w-full",
                        sizeClasses[size],
                        stateClasses[state],
                        leftIcon && "pl-11",
                        rightIcon && "pr-10",
                        className,
                        classNames?.input
                    )}
                />

                {rightIcon && (
                    <div className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                        {rightIcon}
                    </div>
                )}
            </div>

            {description && (
                <p
                    className={clsx(
                        "text-xs leading-4",
                        state === "error" && "text-red-500",
                        state === "warning" && "text-yellow-600",
                        state === "success" && "text-teal-600",
                        state === "base" && "text-muted-foreground",
                        classNames?.description
                    )}
                >
                    {description}
                </p>
            )}
        </div>
    );
};