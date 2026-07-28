import {
    type ChangeEvent,
    type ClipboardEvent,
    type KeyboardEvent,
    useEffect,
    useRef,
} from "react";
import {cn} from "#/lib/utils.ts";

type InputOtpProps = {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
};

export function InputOtp({
                             length = 6,
                             ...props
                         }: InputOtpProps) {
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const values = Array.from(
        { length },
        (_, i) => props.value[i] ?? ""
    );

    const updateValue = (index: number, digit: string) => {
        const next = [...values];
        next[index] = digit;

        props.onChange(next.join(""));
    };

    const handleChange =
        (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value.replace(/\D/g, "");

            if (!input) {
                updateValue(index, "");
                return;
            }

            updateValue(index, input[0]);

            if (index < length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        };

    const handleKeyDown =
        (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Backspace") {
                if (values[index]) {
                    updateValue(index, "");
                    return;
                }

                if (index > 0) {
                    inputsRef.current[index - 1]?.focus();
                }
            }

            if (e.key === "ArrowLeft" && index > 0) {
                inputsRef.current[index - 1]?.focus();
            }

            if (e.key === "ArrowRight" && index < length - 1) {
                inputsRef.current[index + 1]?.focus();
            }
        };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();

        const pasted = e.clipboardData
            .getData("text")
            .replace(/\D/g, "")
            .slice(0, length);

        props.onChange(pasted);

        const focusIndex = Math.min(pasted.length, length - 1);
        inputsRef.current[focusIndex]?.focus();
    };

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    return (
        <div className="flex justify-between w-full gap-3">
            {values.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => {
                        inputsRef.current[index] = el;
                    }}
                    {...props}
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={1}
                    value={digit}
                    disabled={props.disabled}
                    onChange={handleChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={handlePaste}
                    className={cn(
                        "h-15 w-15 rounded-xl border border-border bg-background text-center text-xl font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50",
                    )}
                />
            ))}
        </div>
    );
}