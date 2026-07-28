import {type ChangeEvent, useState} from "react";

type InputElement =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

export function useFormValue<T extends Record<string, string>>(initialValue: T) {
    const [formValue, setFormValue] = useState<T>(initialValue);

    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const handleOnChange = (e: ChangeEvent<InputElement>) => {
        const {name, value} = e.target;

        setFormValue((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: undefined,
        }));
    };

    const clearErrors = () => setErrors({});

    return {
        formValue,
        setFormValue,
        handleOnChange,

        errors,
        setErrors,
        clearErrors,
    };
}